import { gql, useMutation } from '@apollo/react-hooks'

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

const DISABLE_TOTP_MUTATION = gql`
  mutation($password: String!) {
    disableTotp(password: $password)
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

  const [
    disableTotp,
    {
      data: disableData,
      loading: disableLoading,
      error: disableError,
    },
  ] = useMutation(DISABLE_TOTP_MUTATION)

  return {
    setupTotp,
    setupData,
    setupLoading,
    setupError,
    enableTotp,
    enableData,
    enableLoading,
    enableError,
    disableTotp,
    disableData,
    disableLoading,
    disableError,
  }
}
