/* global CodeMirror, html_beautify */
import habitat from 'preact-habitat';
import { WidgetType } from '../types';
import { Toolbar } from './Toolbar';
import './app.css';
import { widgetDefaultContent } from '../defaults';

export default () => {
  const widgetKey = 'active-widget';
  const toolbarSelector = '#toolbar';
  const editor = document.getElementById('editor') as HTMLElement;
  const codeHeader = document.getElementById('code-header') as HTMLElement;
  const codeFooter = document.getElementById('code-footer') as HTMLElement;
  const preview = document.getElementById('preview') as HTMLElement;
  let activeWidget: WidgetType = (localStorage.getItem(widgetKey) as WidgetType) ?? 'search-results';
  const storageKey = `code-content-${activeWidget}`;
  const value = localStorage.getItem(storageKey) || widgetDefaultContent[activeWidget];
  let updateNow = false;
  const codeMirror = window.CodeMirror(editor, {
    value: window.js_beautify(value),
    mode: 'application/json',
    theme: 'material-ocean',
    lineNumbers: true,
  });

  habitat(Toolbar).render({
    selector: toolbarSelector,
    clean: true,
    defaultProps: {
      widget: activeWidget,
      onWidgetChange: (widget: WidgetType) => {
        activeWidget = widget;
        localStorage.setItem(widgetKey, widget);
        updateNow = true;
        codeMirror.setValue(
          window.js_beautify(
            (localStorage.getItem(`code-content-${activeWidget}`) as WidgetType) || widgetDefaultContent[widget],
          ),
        );
      },
    },
  });

  const convertJSON = (json: string, widget: WidgetType) =>
    `
    <div data-widget-hide="${widget === 'overlay' || widget === 'search-input-binding'}" data-widget="${widget}">
      <script type="application/json">
        ${json}
      </script>
    </div>
    `;

  const updatePreview = (json: string, widget: WidgetType) => {
    const jsonData = convertJSON(json, widget);
    let extra = '';

    switch (widget) {
      case 'overlay':
        extra = `
          <form>
            <input type="text" id="search-input" />
            <button type="button" id="button">Open modal</button>
          </form>
        `;
        break;
      case 'search-input-binding':
        extra = `
          <div style="border-radius: 4px;border:2px solid #9CA3AF;margin:10px;padding:10px;">
            <p style="margin-top:0px;">The following 3 inputs are identical and can be retrieved using the <code>form[action="/search"] input[name="q"]</code> selector.</p>
            <form action="/search">
              <input name="q" />
            </form>
            <form action="/search">
              <input name="q" />
            </form>
            <form action="/search">
              <input name="q" />
            </form>
          </div>
          <div id="js-search-input" style="padding:10px;margin:10px;border-radius: 4px;border:2px solid #9CA3AF;">
            <p style="margin-top:0px;">This container has the id of <code>js-search-input</code></p>
            <input style="width: 40%;" />
            <input style="width: 40%;" />
          </div>
          <p>Try switching between <code>"selector": "#js-search-input"</code> and not specifiying a selector at all (which defaults to <code>form[action="/search"] input[name="q"]</code>) to see the difference and use cases.</p>
        `;
        break;
      case 'search-results':
      default:
        break;
    }
    preview.innerHTML = `${jsonData}${extra}`;

    codeHeader.innerText = `
<div data-widget="${widget}">
  <script type="application/json">`.trim();

    codeFooter.innerText = `
  </script>
</div>`.replace('\n', '');
  };

  updatePreview(value, activeWidget);

  document.body.addEventListener('paste', (event) => {
    if (event.target === editor || editor.contains(event.target as Node)) {
      const value = codeMirror.getValue();
      codeMirror.setValue(window.js_beautify(value));
    }
  });

  let timer: number;
  codeMirror.on('change', (instance: any) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(
      () => {
        const value = instance.doc.getValue();
        updatePreview(value, activeWidget);
        localStorage.setItem(`code-content-${activeWidget}`, value);
        updateNow = false;
      },
      updateNow ? 0 : 800,
    );
  });
};
