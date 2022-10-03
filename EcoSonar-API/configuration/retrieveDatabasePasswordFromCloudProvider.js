const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')

async function retrievePassword () {
  if (process.env.ECOSONAR_ENV_CLOUD_PROVIDER === 'AZURE') {
    return retrievePasswordFromAzure()
  } else if (process.env.ECOSONAR_ENV_CLOUD_PROVIDER === 'local') {
    return process.env.ECOSONAR_ENV_PASSWORD || ''
  } else {
    console.log('Could not find password configuration')
    return ''
  }
}

async function retrievePasswordFromAzure () {
  const keyVaultName = process.env.ECOSONAR_ENV_KEY_VAULT_NAME || ''
  const keyVaultUri = 'https://' + keyVaultName + '.vault.azure.net'

  const credential = new DefaultAzureCredential()
  const client = new SecretClient(keyVaultUri, credential)

  const secretName = process.env.ECOSONAR_ENV_SECRET_NAME || ''
  const retrievedSecret = await client.getSecret(secretName)
  return retrievedSecret.value
}

module.exports = { retrievePassword }
