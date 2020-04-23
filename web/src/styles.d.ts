// Declare *.module.css as a dictionary of strings
// This supresses TS errors on module.css imports
declare module '*.module.css' {
  const content: { [key: string]: string }
  export default content
}
