async function testAPI() {
  try {
    console.log('🔗 Testing API call to /api/results');
    const response = await fetch('http://localhost:4000/api/results');
    console.log('✅ API Response Status:', response.status);
    
    const data = await response.json();
    console.log('📊 Results count:', Array.isArray(data) ? data.length : (data?.data?.length || 0));
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('📋 First result:', JSON.stringify(data[0], null, 2));
    } else if (data?.data && data.data.length > 0) {
      console.log('📋 First result (from data property):', JSON.stringify(data.data[0], null, 2));
    } else {
      console.log('⚠️  No results returned');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testAPI();
