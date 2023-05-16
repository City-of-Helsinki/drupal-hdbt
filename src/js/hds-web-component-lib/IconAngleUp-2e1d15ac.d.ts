import { LitElement } from 'lit';
declare class IconAngleUp extends LitElement {
    size: string;
    static readonly styles: import("lit").CSSResult[];
    static get properties(): {
        size: {
            type: StringConstructor;
        };
    };
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-icon-angle-up': IconAngleUp;
    }
}
export { IconAngleUp };
