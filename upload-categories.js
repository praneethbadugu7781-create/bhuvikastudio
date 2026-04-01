const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dfdin5phc',
  api_key: '514444287772746',
  api_secret: 'PXekhoM58Hlgw4-0yclL8p14csY',
});

const downloadsPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads');

const categories = [
  { file: 'kurtssets.jpeg', name: 'Kurta sets' },
  { file: 'sarees.jpeg', name: 'Sarees' },
  { file: 'lehengas.jpeg', name: 'Lehengas' },
  { file: 'indo wear.jpeg', name: 'Indo western' },
  { file: 'kidsware.jpeg', name: 'Kids wear' },
  { file: 'western wear.jpeg', name: 'Western wear' },
  { file: 'co ords sets.jpeg', name: 'Co-ords sets' },
  { file: 'anarkali.jpeg', name: 'Anarkali' },
  { file: 'gowns.jpeg', name: 'Gowns' },
];

async function uploadImages() {
  const urls = {};
  
  for (const cat of categories) {
    const filePath = path.join(downloadsPath, cat.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Not found: ${cat.file}`);
      continue;
    }
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'bhuvika-categories',
        public_id: cat.name.replace(/\s+/g, '-').toLowerCase(),
      });
      
      urls[cat.name] = result.secure_url;
      console.log(`✅ ${cat.name}`);
    } catch (err) {
      console.log(`❌ ${cat.name}: ${err.message}`);
    }
  }
  
  console.log('\n📋 Category URLs:');
  Object.entries(urls).forEach(([name, url]) => {
    console.log(`"${name}": "${url}"`);
  });
  
  fs.writeFileSync('category-urls.json', JSON.stringify(urls, null, 2));
}

uploadImages();
