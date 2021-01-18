((url, id) => {
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement('script');
  script.src = url;
  script.id = id;
  script.async = true;
  document.body.appendChild(script);
})('{url}', 'sajari-widgets');
