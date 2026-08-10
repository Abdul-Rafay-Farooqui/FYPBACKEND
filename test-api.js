const http = require('http');

const teacherId = '13fb70e5-2956-4c58-9164-d4906cbb0758';
const url = `http://localhost:4000/api/results?teacher_id=${teacherId}`;

console.log('🔗 Making request to:', url);

http.get(url, (res) => {
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const results = JSON.parse(data);
      console.log('\n✅ API Response:');
      console.log('📊 Results count:', Array.isArray(results) ? results.length : 0);
      
      if (Array.isArray(results) && results.length > 0) {
        console.log('\n📋 First result:');
        console.log(JSON.stringify(results[0], null, 2));
        
        console.log('\n🔍 Subject in first result?', results[0].subject ? 'YES' : 'NO');
      }
      process.exit(0);
    } catch (e) {
      console.error('❌ Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 500));
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});
