/* global CodeMirror, html_beautify */
import habitat from 'preact-habitat';
import { WidgetType } from '../types';
import { Toolbar } from './Toolbar';
import './app.css';
import { widgetDefaultContent } from '../defaults';

export default () => {
  const storageKey = 'code-content';
  const widgetKey = 'active-widget';
  const toolbarSelector = '#toolbar';
  const value = localStorage.getItem(storageKey) || '';
  const editor = document.getElementById('editor') as HTMLElement;
  const codeHeader = document.getElementById('code-header') as HTMLElement;
  const codeFooter = document.getElementById('code-footer') as HTMLElement;
  const preview = document.getElementById('preview') as HTMLElement;
  let activeWidget: WidgetType = (localStorage.getItem(widgetKey) as WidgetType) ?? 'search-results';
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
        codeMirror.setValue(window.js_beautify(widgetDefaultContent[widget]));
      },
    },
  });

  const convertJSON = (json: string, widget: WidgetType) =>
    `
    <div data-widget-hide="${widget === 'overlay' || widget === 'search-input-binding'}" data-widget="${
      widget === 'overlay' ? 'search-results' : widget
    }">
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
            <input type="text" id="my-input" />
            <button type="button" id="open-modal">Open modal</button>
          </form>
        `;
        break;
      case 'search-input-binding':
        extra = `
          <div id="js-search-input">
            <input />
          </div>
        `;
        break;
      case 'search-results':
      default:
        break;
    }
    preview.innerHTML = `${jsonData}${extra}`;

    codeHeader.innerText = `
<div data-widget="${widget === 'overlay' ? 'search-results' : widget}">
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
        localStorage.setItem('code-content', value);
        updateNow = false;
      },
      updateNow ? 0 : 800,
    );
  });
};
