import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { secretsManager } from 'middy/middlewares'
import * as middy from 'middy'

const logger = createLogger('auth')
// const secret_key = process.env.AUTH0_SECRET
// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-lg8nft3id3y37mhr.us.auth0.com/.well-known/jwks.json'


export const handler = middy(
  async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}
)
async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;
  if (jwt.header.alg !== 'RS256'){
        throw new Error('JWT is not RSA')
  }
  const options = {
    method:'GET',
    url:jwksUrl
  }

  const response = await Axios.request(options);
  const keys = response.data.keys;
  const signingKeys = keys.filter(el => el.kid === jwt.header.kid)
  logger.info("This is the signkeys filtered generated"+ signingKeys)
  const cert = '-----BEGIN CERTIFICATE-----'+'\n'+ signingKeys[0].x5c[0]+'\n'+'-----END CERTIFICATE-----'
  logger.info("Built certificate"+ cert)   
  const results = verify(token,cert , { algorithms: ['RS256'] }) as JwtPayload
  return results;
};
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/


function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  logger.info("working with this token", token)
  return token
}

handler.use(
  secretsManager({
    cache: true,
    cacheExpiryInMillis: 60000,
    // Throw an error if can't read the secret
    throwOnFailedCall: true,
    // secrets: {
    //   AUTH0_SECRET: secretId
    // }
  })
)