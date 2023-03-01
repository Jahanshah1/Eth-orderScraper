
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/large-orders/:coin', async (req, res) => {
  const apiKey = 'MZTFG4W45BMSJBCSKAS68HPHR8YBA5RXYY'
  const { coin } = req.params;
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${coin}&sort=desc&${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const data = response.data;
  
    if ('result' in data) {
      const largeBuyOrders = data.result.filter(order => parseFloat(order.value) > 1000000);
      const largeSellOrders = data.result.filter(order => parseFloat(order.value) < -1000000);
      const result = { coin, large_buy_orders: largeBuyOrders, large_sell_orders: largeSellOrders };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result, null, 2));
    } else {
      res.json({ error: data.message });
    }
  
  } catch (error) {
    res.json({ error: error.message });
  }
  
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//http://localhost:3000/large-orders/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0