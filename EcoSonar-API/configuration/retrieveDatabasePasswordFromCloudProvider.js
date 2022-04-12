const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')

async function retrievePassword () {
  if (process.env.CLOUD_PROVIDER === 'AZURE') {
    return retrievePasswordFromAzure()
  } else {
    console.log('Could not retrieved cloud provider')
    return ''
  }
}

async function retrievePasswordFromAzure () {
  const keyVaultName = process.env.KEY_VAULT_NAME || ''
  const keyVaultUri = 'https://' + keyVaultName + '.vault.azure.net'

  const credential = new DefaultAzureCredential()
  const client = new SecretClient(keyVaultUri, credential)

  const secretName = process.env.SECRET_NAME || ''
  const retrievedSecret = await client.getSecret(secretName)
  return retrievedSecret.value
}

module.exports = { retrievePassword }
