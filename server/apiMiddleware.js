import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Helper to safely read JSON
function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

// Helper to safely write JSON
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Default settings
const DEFAULT_SETTINGS = {
  deliveryDhaka: 80,
  deliveryOutside: 130,
  freeDeliveryThreshold: 5000,
  bkashNumber: "01700-000000",
  nagadNumber: "01800-000000",
  whatsappNumber: "8801700000000",
  adminPin: "didar1122",
  securityQuestion: "আপনার প্রিয় মানুষের নাম কী?",
  securityAnswer: "didaroshi",
  telegramBotToken: "",
  telegramChatId: "",
  announcementText: {
    bn: "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি | ঢাকার ভেতরে ৮০৳, বাইরে ১৩০৳",
    en: "Cash on Delivery All Over Bangladesh | Dhaka 80৳, Outside 130৳"
  }
};

// No fake demo orders - store starts clean with real customer orders only
const INITIAL_ORDERS = [];

// Send Telegram notification if configured
async function sendTelegramAlert(order, settings) {
  if (!settings.telegramBotToken || !settings.telegramChatId) return;

  try {
    const itemsSummary = order.items
      .map(i => `• ${i.name.bn} (${i.color}, ${i.size}) x${i.quantity} = ৳${i.price * i.quantity}`)
      .join('\n');

    const message = `🔔 *নতুন ARDO অর্ডার এসেছে!*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🆔 *অর্ডার আইডি:* \`${order.id}\`\n` +
      `👤 *গ্রাহক:* ${order.customer.name}\n` +
      `📞 *মোবাইল:* \`${order.customer.phone}\`\n` +
      `📍 *ঠিকানা:* ${order.customer.address} (${order.customer.district === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})\n` +
      `💳 *পেমেন্ট:* ${order.payment.method.toUpperCase()} (${order.payment.trxId || 'N/A'})\n` +
      `💰 *মোট বিল:* ৳${order.pricing.grandTotal}\n` +
      `📦 *আইটেম:*\n${itemsSummary}\n` +
      (order.customer.note ? `📝 *নোট:* ${order.customer.note}\n` : '') +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👉 অ্যাডমিন প্যানেল: http://localhost:5173/#admin`;

    const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    console.log('Telegram notification sent successfully!');
  } catch (err) {
    console.error('Failed to send Telegram alert:', err);
  }
}

// Shared API Request Handler (used by both Vite dev plugin and production standalone server)
export async function apiHandler(req, res, next) {
  if (!req.url.startsWith('/api/')) {
    if (next) return next();
    return false;
  }

  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `http://${host}`);
  const pathname = url.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  // Helper to read body
  const getBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });

        // 1. GET /api/orders
        if (pathname === '/api/orders' && method === 'GET') {
          const orders = readJSON(ORDERS_FILE, INITIAL_ORDERS);
          res.statusCode = 200;
          return res.end(JSON.stringify(orders));
        }

        // 2. POST /api/orders (Create Order)
        if (pathname === '/api/orders' && method === 'POST') {
          const orderData = await getBody();
          const orders = readJSON(ORDERS_FILE, INITIAL_ORDERS);
          const settings = readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);

          const newOrderId = orderData.id || ('ARDO-' + Math.floor(100000 + Math.random() * 900000));
          const newOrder = {
            id: newOrderId,
            createdAt: orderData.createdAt || new Date().toISOString(),
            customer: orderData.customer,
            items: orderData.items,
            pricing: orderData.pricing,
            payment: orderData.payment,
            status: orderData.status || 'pending',
            courier: orderData.courier || { provider: 'Steadfast Courier', trackingCode: '' }
          };

          orders.unshift(newOrder);
          writeJSON(ORDERS_FILE, orders);

          // Trigger Telegram alert in background
          sendTelegramAlert(newOrder, settings);

          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, order: newOrder }));
        }

        // 3. PATCH /api/orders/:id
        const orderPatchMatch = pathname.match(/^\/api\/orders\/([^\/]+)$/);
        if (orderPatchMatch && method === 'PATCH') {
          const orderId = orderPatchMatch[1];
          const updates = await getBody();
          const orders = readJSON(ORDERS_FILE, INITIAL_ORDERS);
          const idx = orders.findIndex(o => o.id === orderId);

          if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...updates };
            writeJSON(ORDERS_FILE, orders);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, order: orders[idx] }));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Order not found' }));
          }
        }

        // 4. DELETE /api/orders/:id
        if (orderPatchMatch && method === 'DELETE') {
          const orderId = orderPatchMatch[1];
          let orders = readJSON(ORDERS_FILE, INITIAL_ORDERS);
          orders = orders.filter(o => o.id !== orderId);
          writeJSON(ORDERS_FILE, orders);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        // 5. POST /api/orders/reset
        if (pathname === '/api/orders/reset' && method === 'POST') {
          writeJSON(ORDERS_FILE, INITIAL_ORDERS);
          res.statusCode = 200;
          return res.end(JSON.stringify(INITIAL_ORDERS));
        }

        // 6. GET /api/settings
        if (pathname === '/api/settings' && method === 'GET') {
          const settings = readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
          res.statusCode = 200;
          return res.end(JSON.stringify(settings));
        }

        // 7. POST /api/settings
        if (pathname === '/api/settings' && method === 'POST') {
          const newSettings = await getBody();
          const settings = readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
          const merged = { ...settings, ...newSettings };
          writeJSON(SETTINGS_FILE, merged);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, settings: merged }));
        }

        // 8. GET /api/products
        if (pathname === '/api/products' && method === 'GET') {
          const products = readJSON(PRODUCTS_FILE, []);
          res.statusCode = 200;
          return res.end(JSON.stringify(products));
        }

        // 9. POST /api/products (Create Product)
        if (pathname === '/api/products' && method === 'POST') {
          const productData = await getBody();
          const products = readJSON(PRODUCTS_FILE, []);
          
          const newId = productData.id || (
            products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1
          );

          const newProduct = {
            id: newId,
            name: {
              bn: productData.name?.bn || productData.name || 'নতুন প্রিমিয়াম পোশাক',
              en: productData.name?.en || 'New Premium Apparel'
            },
            category: productData.category || 'panjabi',
            categoryLabel: {
              bn: productData.category === 'shirt' ? 'ফরমাল শার্ট' : 'প্রিমিয়াম পাঞ্জাবি',
              en: productData.category === 'shirt' ? 'Formal Shirt' : 'Premium Panjabi'
            },
            price: Number(productData.price) || 2500,
            originalPrice: Number(productData.originalPrice) || (Number(productData.price) ? Math.round(Number(productData.price) * 1.15) : 2950),
            badge: productData.badge || { bn: "নতুন আগমন", en: "NEW", type: "new" },
            image: productData.image || (productData.colors?.[0]?.image) || '/images/products/shirt-black-model.jpg',
            fabric: {
              bn: productData.fabric?.bn || productData.fabric || '১০০% ফাইন প্রিমিয়াম ফেব্রিক',
              en: productData.fabric?.en || '100% Fine Premium Fabric'
            },
            fit: {
              bn: productData.fit?.bn || productData.fit || 'টেইলর্ড স্লিম ফিট',
              en: productData.fit?.en || 'Tailored Slim Fit'
            },
            sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0 
              ? productData.sizes 
              : ["38", "40", "42", "44"],
            colors: Array.isArray(productData.colors) && productData.colors.length > 0
              ? productData.colors
              : [
                  { 
                    id: "primary", 
                    name: { bn: "মূল কালার", en: "Primary Color" }, 
                    hex: "#18181B",
                    image: productData.image || '/images/products/shirt-black-model.jpg'
                  }
                ],
            isNew: productData.isNew !== undefined ? productData.isNew : true,
            isOutOfStock: productData.isOutOfStock || false,
            rating: productData.rating || 5.0,
            reviewsCount: productData.reviewsCount || 0,
            description: {
              bn: productData.description?.bn || productData.description || 'ARDO-র আধুনিক কালেকশন। আরামদায়ক ও নিখুঁত ফিনিশিং।',
              en: productData.description?.en || 'Modern luxury collection crafted with exceptional comfort and finish.'
            }
          };

          products.unshift(newProduct);
          writeJSON(PRODUCTS_FILE, products);
          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, product: newProduct }));
        }

        // 10. PUT / PATCH /api/products/:id (Update Product)
        const prodMatch = pathname.match(/^\/api\/products\/([^\/]+)$/);
        if (prodMatch && (method === 'PUT' || method === 'PATCH')) {
          const prodId = prodMatch[1];
          const updates = await getBody();
          let products = readJSON(PRODUCTS_FILE, []);
          
          const idx = products.findIndex(p => String(p.id) === String(prodId));
          if (idx !== -1) {
            products[idx] = {
              ...products[idx],
              ...updates,
              // Keep ID intact
              id: products[idx].id,
              // Normalize price if provided
              price: updates.price !== undefined ? Number(updates.price) : products[idx].price,
              originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : products[idx].originalPrice
            };
            writeJSON(PRODUCTS_FILE, products);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, product: products[idx] }));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Product not found' }));
          }
        }

        // 11. DELETE /api/products/:id (Delete Product)
        if (prodMatch && method === 'DELETE') {
          const prodId = prodMatch[1];
          let products = readJSON(PRODUCTS_FILE, []);
          const initialLen = products.length;
          products = products.filter(p => String(p.id) !== String(prodId));
          
          if (products.length < initialLen) {
            writeJSON(PRODUCTS_FILE, products);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deletedId: prodId }));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Product not found' }));
          }
        }

        // 12. POST /api/upload (Image Upload)
        if (pathname === '/api/upload' && method === 'POST') {
          const body = await getBody();
          const { dataUrl, filename } = body;
          if (!dataUrl) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'No dataUrl provided' }));
          }
          const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid base64 format' }));
          }
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = path.extname(filename || 'image.jpg') || '.jpg';
          const safeName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
          const uploadsDir = path.resolve(__dirname, '../public/images/uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const filePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(filePath, buffer);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, url: `/images/uploads/${safeName}` }));
        }

        // 13. POST /api/telegram/test
        if (pathname === '/api/telegram/test' && method === 'POST') {
          const { token, chatId } = await getBody();
          try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const resp = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '✅ *ARDO Menswear Telegram Notification Test*\n\nআপনার Telegram Bot সঠিকভাবে সংযুক্ত হয়েছে!',
                parse_mode: 'Markdown'
              })
            });
            const data = await resp.json();
            res.statusCode = 200;
            return res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // 14. POST /api/auth/verify-security
        if (pathname === '/api/auth/verify-security' && method === 'POST') {
          const { answer } = await getBody();
          const settings = readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
          const correctAnswer = (settings.securityAnswer || 'didaroshi').trim().toLowerCase();
          const providedAnswer = (answer || '').trim().toLowerCase();

          if (providedAnswer && providedAnswer === correctAnswer) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ 
              success: true, 
              question: settings.securityQuestion || 'আপনার প্রিয় মানুষের নাম কী?',
              currentPin: settings.adminPin || 'didar1122'
            }));
          } else {
            res.statusCode = 400;
            return res.end(JSON.stringify({ 
              success: false, 
              error: 'ভুল উত্তর! সঠিক নিরাপত্তা উত্তর দিন।' 
            }));
          }
        }

        // 15. POST /api/auth/reset-password
        if (pathname === '/api/auth/reset-password' && method === 'POST') {
          const { answer, newPassword } = await getBody();
          const settings = readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
          const correctAnswer = (settings.securityAnswer || 'didaroshi').trim().toLowerCase();
          const providedAnswer = (answer || '').trim().toLowerCase();

          if (!providedAnswer || providedAnswer !== correctAnswer) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: 'ভুল নিরাপত্তা উত্তর!' }));
          }

          if (!newPassword || newPassword.trim().length < 4) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: 'পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে।' }));
          }

          const cleanPin = newPassword.trim();
          settings.adminPin = cleanPin;
          writeJSON(SETTINGS_FILE, settings);

          res.statusCode = 200;
          return res.end(JSON.stringify({ 
            success: true, 
            message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!',
            newPin: cleanPin 
          }));
        }

  if (next) return next();
  return false;
}

// Main Vite Server Middleware Plugin
export function ardoApiPlugin() {
  return {
    name: 'ardo-backend-api',
    configureServer(server) {
      server.middlewares.use(apiHandler);
    }
  };
}
