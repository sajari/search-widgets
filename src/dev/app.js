/* global CodeMirror, html_beautify */

(() => {
  const storageKey = 'code-content';
  const value = localStorage.getItem(storageKey) || '';
  const editor = document.getElementById('editor');
  const codeHeader = document.getElementById('code-header');
  const codeFooter = document.getElementById('code-footer');
  const preview = document.getElementById('preview');

  const convertJSON = (json) =>
    `
    <div data-widget="search-results">
      <script type="application/json">
        ${json}
      </script>
    </div>
    <div data-widget="search-input-binding">
      <script type="application/json">
        ${JSON.stringify({ ...JSON.parse(json === '' ? '{}' : json), selector: '#js-search-input' })}
      </script>
    </div>
    `;

  codeHeader.innerText = `
<div data-widget="search-results">
  <script type="application/json">`.trim();

  codeFooter.innerText = `
  </script>
</div>`.replace('\n', '');

  preview.innerHTML = convertJSON(value);

  const codeMirror = CodeMirror(editor, {
    value: js_beautify(value),
    mode: 'application/json',
    theme: 'material-ocean',
    lineNumbers: true,
  });

  document.body.addEventListener('paste', (event) => {
    if (event.target === editor || editor.contains(event.target)) {
      const value = codeMirror.getValue();
      codeMirror.setValue(js_beautify(value));
    }
  });

  let timer;
  codeMirror.on('change', (instance) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      const value = instance.doc.getValue();
      preview.innerHTML = convertJSON(value);
      localStorage.setItem('code-content', value);
    }, 800);
  });
})();
