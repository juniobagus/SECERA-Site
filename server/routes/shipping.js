const express = require('express');
const router = express.Router();

const RAJAONGKIR_KEY = process.env.RAJAONGKIR_API_KEY || '';
const RAJAONGKIR_BASE = 'https://rajaongkir.komerce.id/api/v1';

const PROVINCES = [
  { province_id: "1", province: "Aceh" },
  { province_id: "2", province: "Bali" },
  { province_id: "3", province: "Banten" },
  { province_id: "4", province: "Bengkulu" },
  { province_id: "5", province: "DI Yogyakarta" },
  { province_id: "6", province: "DKI Jakarta" },
  { province_id: "7", province: "Gorontalo" },
  { province_id: "8", province: "Jambi" },
  { province_id: "9", province: "Jawa Barat" },
  { province_id: "10", province: "Jawa Tengah" },
  { province_id: "11", province: "Jawa Timur" },
  { province_id: "12", province: "Kalimantan Barat" },
  { province_id: "13", province: "Kalimantan Selatan" },
  { province_id: "14", province: "Kalimantan Tengah" },
  { province_id: "15", province: "Kalimantan Timur" },
  { province_id: "16", province: "Kalimantan Utara" },
  { province_id: "17", province: "Kepulauan Bangka Belitung" },
  { province_id: "18", province: "Kepulauan Riau" },
  { province_id: "19", province: "Lampung" },
  { province_id: "20", province: "Maluku" },
  { province_id: "21", province: "Maluku Utara" },
  { province_id: "22", province: "Nusa Tenggara Barat (NTB)" },
  { province_id: "23", province: "Nusa Tenggara Timur (NTT)" },
  { province_id: "24", province: "Papua" },
  { province_id: "25", province: "Papua Barat" },
  { province_id: "26", province: "Riau" },
  { province_id: "27", province: "Sulawesi Barat" },
  { province_id: "28", province: "Sulawesi Selatan" },
  { province_id: "29", province: "Sulawesi Tengah" },
  { province_id: "30", province: "Sulawesi Tenggara" },
  { province_id: "31", province: "Sulawesi Utara" },
  { province_id: "32", province: "Sumatera Barat" },
  { province_id: "33", province: "Sumatera Selatan" },
  { province_id: "34", province: "Sumatera Utara" }
];

async function komerceGet(endpoint) {
  try {
    const response = await fetch(`${RAJAONGKIR_BASE}${endpoint}`, {
      headers: { 'key': RAJAONGKIR_KEY, 'Accept': 'application/json' }
    });
    return await response.json();
  } catch (err) {
    throw err;
  }
}

async function komercePost(endpoint, body) {
  try {
    const response = await fetch(`${RAJAONGKIR_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'key': RAJAONGKIR_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(body).toString()
    });
    return await response.json();
  } catch (err) {
    throw err;
  }
}

router.get('/provinces', (req, res) => res.json(PROVINCES));

// GET Search Destination (Autocomplete)
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 3) return res.json([]);
  
  try {
    const result = await komerceGet(`/destination/domestic-destination?search=${encodeURIComponent(q)}&limit=20`);
    if (result.meta?.status !== 'success') return res.status(500).json({ message: 'Error' });
    
    // Map result for autocomplete
    const suggestions = result.data.map(item => ({
      id: item.id,
      label: item.label, // Format: Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos
      city_name: item.city_name,
      district_name: item.district_name,
      subdistrict_name: item.subdistrict_name,
      province_name: item.province_name,
      zip_code: item.zip_code
    }));
    
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

router.post('/cost', async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  try {
    const result = await komercePost('/calculate/domestic-cost', { origin, destination, weight, courier: courier || 'jnt' });
    if (result.meta?.status !== 'success') return res.status(500).json({ message: 'Error' });
    const transformed = [{
      code: courier || 'jnt', name: 'J&T',
      costs: result.data.map(item => ({
        service: item.service, description: item.description,
        cost: [{ value: item.cost, etd: item.etd, note: '' }]
      }))
    }];
    res.json(transformed);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.get('/track', async (req, res) => {
  const { resi, courier } = req.query;
  if (!resi) return res.status(400).json({ message: 'Resi is required' });
  
  try {
    const result = await komerceGet(`/tracking/waybill?waybill=${encodeURIComponent(resi)}&courier=${encodeURIComponent(courier || 'jnt')}`);
    if (result.meta?.status !== 'success') return res.status(500).json({ message: 'Error tracking waybill', details: result });
    
    res.json(result.data);
  } catch (err) {
    console.error('Error tracking:', err);
    res.status(500).json({ message: 'Error tracking' });
  }
});

module.exports = router;
