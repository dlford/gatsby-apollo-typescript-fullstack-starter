import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const SETUP_TOTP_MUTATION = gql`
  mutation {
    setupTotp {
      base32
      qr
    }
  }
`

const ENABLE_TOTP_MUTATION = gql`
  mutation($token: String!) {
    enableTotp(token: $token) {
      recoveryCodes
    }
  }
`

export default function useTotpSetup() {
  const [
    setupTotp,
    { data: setupData, loading: setupLoading, error: setupError },
  ] = useMutation(SETUP_TOTP_MUTATION)

  const [
    enableTotp,
    { data: enableData, loading: enableLoading, error: enableError },
  ] = useMutation(ENABLE_TOTP_MUTATION)

  return {
    setupTotp,
    setupData,
    setupLoading,
    setupError,
    enableTotp,
    enableData,
    enableLoading,
    enableError,
  }
}
