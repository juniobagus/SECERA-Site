const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

async function migrate() {
  console.log('Starting SEO Migration...');

  try {
    // Helper to run query and ignore specific errors
    const runQuery = async (sql, ignoreCodes = []) => {
      try {
        await db.query(sql);
      } catch (err) {
        if (ignoreCodes.includes(err.code) || ignoreCodes.includes(err.errno)) {
          // console.log(`  (Ignored expected error: ${err.code})`);
        } else {
          throw err;
        }
      }
    };

    const DUP_COLUMN = 1060;

    // 1. Add columns to products
    console.log('Updating products table...');
    await runQuery('ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE AFTER short_name', [DUP_COLUMN]);
    await runQuery('ALTER TABLE products ADD COLUMN seo_title VARCHAR(255) AFTER cms_content', [DUP_COLUMN]);
    await runQuery('ALTER TABLE products ADD COLUMN seo_description TEXT AFTER seo_title', [DUP_COLUMN]);
    await runQuery('ALTER TABLE products ADD COLUMN og_image_url TEXT AFTER seo_description', [DUP_COLUMN]);

    // 2. Add columns to jobs
    console.log('Updating jobs table...');
    await runQuery('ALTER TABLE jobs ADD COLUMN slug VARCHAR(255) UNIQUE AFTER title', [DUP_COLUMN]);
    await runQuery('ALTER TABLE jobs ADD COLUMN seo_title VARCHAR(255) AFTER benefits', [DUP_COLUMN]);
    await runQuery('ALTER TABLE jobs ADD COLUMN seo_description TEXT AFTER seo_title', [DUP_COLUMN]);
    await runQuery('ALTER TABLE jobs ADD COLUMN og_image_url TEXT AFTER seo_description', [DUP_COLUMN]);

    // 3. Add columns to categories
    console.log('Updating categories table...');
    await runQuery('ALTER TABLE categories ADD COLUMN seo_title VARCHAR(255) AFTER slug', [DUP_COLUMN]);
    await runQuery('ALTER TABLE categories ADD COLUMN seo_description TEXT AFTER seo_title', [DUP_COLUMN]);
    await runQuery('ALTER TABLE categories ADD COLUMN og_image_url TEXT AFTER seo_description', [DUP_COLUMN]);

    // 4. Create product_tags table
    console.log('Creating product_tags table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS product_tags (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        seo_title VARCHAR(255),
        seo_description TEXT,
        og_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Create product_tag_map table
    console.log('Creating product_tag_map table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS product_tag_map (
        product_id VARCHAR(36),
        tag_id VARCHAR(36),
        PRIMARY KEY (product_id, tag_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES product_tags(id) ON DELETE CASCADE
      )
    `);

    // 6. Migrate existing tags from products (JSON) to new tables
    console.log('Migrating existing tags...');
    const [products] = await db.query('SELECT id, tags FROM products WHERE tags IS NOT NULL');
    
    for (const product of products) {
      let tags = [];
      try {
        tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
      } catch (e) {
        console.error(`Error parsing tags for product ${product.id}:`, e);
        continue;
      }

      if (!Array.isArray(tags)) continue;

      for (const tagName of tags) {
        if (!tagName) continue;
        
        // Ensure tag exists in product_tags
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let [existingTags] = await db.query('SELECT id FROM product_tags WHERE name = ?', [tagName]);
        let tagId;
        
        if (existingTags.length === 0) {
          tagId = uuidv4();
          try {
            await db.query(
              'INSERT INTO product_tags (id, name, slug) VALUES (?, ?, ?)',
              [tagId, tagName, slug]
            );
          } catch (e) {
            // Might have been inserted by a parallel iteration
            const [reCheck] = await db.query('SELECT id FROM product_tags WHERE name = ?', [tagName]);
            tagId = reCheck[0].id;
          }
        } else {
          tagId = existingTags[0].id;
        }

        // Map product to tag
        await db.query(
          'INSERT IGNORE INTO product_tag_map (product_id, tag_id) VALUES (?, ?)',
          [product.id, tagId]
        );
      }
    }

    // 7. Initialize slugs for existing products and jobs if empty
    console.log('Initializing slugs for products...');
    const [prodsWithoutSlug] = await db.query('SELECT id, name FROM products WHERE slug IS NULL OR slug = ""');
    for (const p of prodsWithoutSlug) {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + p.id.substring(0, 4);
      await db.query('UPDATE products SET slug = ? WHERE id = ?', [slug, p.id]);
    }

    console.log('Initializing slugs for jobs...');
    const [jobsWithoutSlug] = await db.query('SELECT id, title FROM jobs WHERE slug IS NULL OR slug = ""');
    for (const j of jobsWithoutSlug) {
      const slug = j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + j.id.substring(0, 4);
      await db.query('UPDATE jobs SET slug = ? WHERE id = ?', [slug, j.id]);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
