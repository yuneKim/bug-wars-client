import { Quill } from '@vueup/vue-quill';

export function configureQuill() {
  const Clipboard = Quill.import('modules/clipboard');
  const delta = Quill.import('delta');
  const Block = Quill.import('blots/block');
  Block.tagName = 'DIV';
  Quill.register(Block, true);

  class PlainClipboard extends Clipboard {
    convert(this: any, html = null) {
      if (typeof html === 'string') {
        this.container.innerHTML = html;
      }
      const text = this.container.innerText;
      this.container.innerHTML = '';
      return new delta().insert(text);
    }
  }

  Quill.register('modules/clipboard', PlainClipboard, true);
}

export const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: function (this: any, range: any, context: any) {
            if (context.prefix.startsWith(':')) {
              this.quill.insertText(range.index, '\t', 'user');
              setTimeout(() => {
                this.quill.setSelection(range.index + 2);
              }, 0);
            } else if (context.prefix.startsWith('\t')) {
              const tabs = context.prefix.match(/\t/g)?.length ?? 0;

              this.quill.insertText(range.index, '\t'.repeat(tabs), 'user');
              setTimeout(() => {
                this.quill.setSelection(range.index + 2 * tabs);
              }, 0);
            }
            return true;
          },
        },
      },
    },
  },
};
