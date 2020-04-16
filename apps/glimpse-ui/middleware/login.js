export default function ({ query, redirect }) {
  if (!query.ticket) {
    return redirect('https://cas-auth.rpi.edu/cas/login?service=' + encodeURIComponent(process.env.CAS_SERVICE_URL))
  }
}
