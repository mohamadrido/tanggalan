document.getElementById('generate-2048').addEventListener('click', function() {
    generateSSHKeys(2048);
});

document.getElementById('generate-4096').addEventListener('click', function() {
    generateSSHKeys(4096);
});

document.getElementById('save-public-key').addEventListener('click', savePublicKey);
document.getElementById('save-private-key').addEventListener('click', savePrivateKey);

function generateSSHKeys(bits) {
    // Generate RSA key pair
    forge.pki.rsa.generateKeyPair({ bits: bits, workers: 2 }, function(err, keypair) {
        if (err) {
            console.error(err);
            return;
        }

        // Convert the private key to PEM format
        var privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

        // Convert the public key to OpenSSH format
        var sshPublicKey = forge.ssh.publicKeyToOpenSSH(keypair.publicKey);

        // Display the keys in the text areas
        document.getElementById('private-key').value = privateKeyPem;
        document.getElementById('public-key').value = sshPublicKey;

        // Aktifkan tombol Save File
        document.getElementById('save-public-key').disabled = false;
        document.getElementById('save-private-key').disabled = false;
    });
}

function savePublicKey() {
    var publicKey = document.getElementById('public-key').value;
    var openSSHKey = publicKey.split(' ')[1]; // Mengambil bagian kunci publik OpenSSH saja
    downloadFile(openSSHKey, 'public_key.pub');
}

function savePrivateKey() {
    var privateKey = document.getElementById('private-key').value;
    downloadFile(privateKey, 'private_key.pem');
}

function downloadFile(content, fileName) {
    var blob = new Blob([content], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var ext = fileName.split('.').pop();
    var fileExt = (ext === 'pub') ? '.pub' : '.pem';
    a.href = url;
    a.download = fileName + fileExt;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}