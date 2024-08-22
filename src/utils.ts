export function div(content: string): HTMLElement;
export function div(attributes: object): HTMLElement;
export function div(content: string, attributes: object): HTMLElement;
export function div(...args: any): HTMLElement {
    const div = document.createElement('div');
    var content = undefined;
    var attrs = undefined;

    if (args.length === 1) {
        const arg = args[0];
        if (typeof arg === 'string') content = arg;
        if (typeof arg === 'object') attrs = arg;
    }
    if (args.length === 2) {
        content = args[0];
        attrs = args[1];
    }

    if (content) {
        div.innerHTML = content;
    }

    if (attrs) {
        Object.entries<string>(attrs).forEach(([attr, value]) => {
            div.setAttribute(attr, value);
        });
    }

    return div;
};