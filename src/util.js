export const relativeRedirect = (url, keepSearch=true) => {
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  if (!url.includes('?') && window.location.search && keepSearch) {
    url += window.location.search;
  }
  window.location = (`${window.location.origin}${url}`)
}

export const setSentryInstalled = sentryInstalled => {
  const val = sentryInstalled ? '1' : '0';
  localStorage.setItem('sentryInstalled', val)
}


export const isSentryInstalled = () => {
  return localStorage.getItem('sentryInstalled') === '1';
}
