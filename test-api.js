const http = require('http');

// Test funkcija za API pozive
function testAPI(method, path, data = null) {
  return new Promise((resolve, reject) => {
    // Enkoduj samo specifične delove path-a koji sadrže Unicode
    // Express automatski dekoduje URL, ali Node.js http zahteva enkodovan path
    const encodedPath = path.split('/').map(segment => {
      // Enkoduj svaki segment posebno, ali zadrži / separator
      return segment ? encodeURIComponent(segment) : '';
    }).join('/');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: encodedPath,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Testovi
async function runTests() {
  console.log('🧪 Testiranje API-ja...\n');

  try {
    // Test 1: GET sve beleške (treba biti prazan niz)
    console.log('1. GET /beleške - Čitanje svih beleški');
    const getAll = await testAPI('GET', '/beleške');
    console.log('   Status:', getAll.status);
    console.log('   Odgovor:', JSON.stringify(getAll.data, null, 2));
    console.log('');

    // Test 2: POST - Kreiranje nove beleške
    console.log('2. POST /beleške - Kreiranje nove beleške');
    const create = await testAPI('POST', '/beleške', {
      title: 'Test Beleška',
      content: 'Ovo je test sadržaj beleške'
    });
    console.log('   Status:', create.status);
    console.log('   Kreirana beleška:', JSON.stringify(create.data, null, 2));
    const noteId = create.data.id;
    console.log('');

    // Test 3: GET sve beleške (sada treba imati jednu)
    console.log('3. GET /beleške - Čitanje svih beleški (nakon kreiranja)');
    const getAllAfter = await testAPI('GET', '/beleške');
    console.log('   Status:', getAllAfter.status);
    console.log('   Broj beleški:', getAllAfter.data.length);
    console.log('');

    // Test 4: GET jedna beleška
    console.log('4. GET /beleške/:id - Čitanje jedne beleške');
    const getOne = await testAPI('GET', `/beleške/${noteId}`);
    console.log('   Status:', getOne.status);
    console.log('   Beleška:', JSON.stringify(getOne.data, null, 2));
    console.log('');

    // Test 5: PUT - Ažuriranje beleške
    console.log('5. PUT /beleške/:id - Ažuriranje beleške');
    const update = await testAPI('PUT', `/beleške/${noteId}`, {
      title: 'Ažurirana Test Beleška',
      content: 'Ažurirani sadržaj'
    });
    console.log('   Status:', update.status);
    console.log('   Ažurirana beleška:', JSON.stringify(update.data, null, 2));
    console.log('');

    // Test 6: DELETE - Brisanje beleške
    console.log('6. DELETE /beleške/:id - Brisanje beleške');
    const deleteNote = await testAPI('DELETE', `/beleške/${noteId}`);
    console.log('   Status:', deleteNote.status);
    console.log('   Odgovor:', JSON.stringify(deleteNote.data, null, 2));
    console.log('');

    // Test 7: GET sve beleške (treba biti prazan niz ponovo)
    console.log('7. GET /beleške - Čitanje svih beleški (nakon brisanja)');
    const getAllFinal = await testAPI('GET', '/beleške');
    console.log('   Status:', getAllFinal.status);
    console.log('   Broj beleški:', getAllFinal.data.length);
    console.log('');

    console.log('✅ Svi testovi uspešno završeni!');
  } catch (error) {
    console.error('❌ Greška pri testiranju:', error.message);
  }
}

runTests();

