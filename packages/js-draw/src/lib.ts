/**
 * The main entrypoint for the NPM package. Everything exported by this file
 * is available through the [`js-draw` package](https://www.npmjs.com/package/js-draw).
 *
 * @example
 * ```ts,runnable
 * import { Editor, Vec3, Mat33, ToolbarWidgetTag } from 'js-draw';
 *
 * // Apply js-draw CSS
 * import 'js-draw/styles';
 * // If your bundler doesn't support the above, try
 * // import 'js-draw/bundledStyles';
 *
 * (async () => {
 *   const editor = new Editor(document.body);
 *   const toolbar = editor.addToolbar();
 *
 *   // Increases the minimum height of the editor
 *   editor.getRootElement().style.height = '600px';
 *
 *   // Loads from SVG data
 *   await editor.loadFromSVG(`
 *       <svg viewBox="0 0 500 500" width="500" height="500" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
 *           <style id="js-draw-style-sheet">path{stroke-linecap:round;stroke-linejoin:round;}text{white-space:pre;}</style>
 *           <path d="M500,500L500,0L0,0L0,500L500,500" fill="#423131bf" class="js-draw-image-background"></path>
 *           <text style="transform: matrix(1, 0, 0, 1, 57, 192); font-family: serif; font-size: 32px; fill: rgb(204, 102, 51);">Testing...</text>
 *       </svg>
 *   `);
 *
 *   // Adding tags to a toolbar button allows different styles to be applied.
 *   // Also see addActionButton.
 *   const buttonLabels = [ ToolbarWidgetTag.Save ];
 *
 *   toolbar.addTaggedActionButton(buttonLabels, {
 *     label: 'Save',
 *     icon: editor.icons.makeSaveIcon(),
 *   }, () => {
 *     const saveData = editor.toSVG().outerHTML;
 *
 *     // Do something with saveData
 *   });
 * })();
 * ```
 *
 * @see
 * {@link Editor}
 * {@link Editor.loadFromSVG}
 * {@link AbstractToolbar.addActionButton }
 *
 * @packageDocumentation
 */

import Editor, { EditorSettings } from './Editor';
export { default as EditorImage } from './EditorImage';
export * from './types';
export * from './inputEvents';
export { default as getLocalizationTable, matchingLocalizationTable } from './localizations/getLocalizationTable';
export * from './localization';

export { default as SVGLoader } from './SVGLoader';
export { default as Viewport } from './Viewport';
export * from '@js-draw/math';
export * from './components/lib';
export * from './commands/lib';
export * from './tools/lib';
export * from './toolbar/lib';
export * from './rendering/lib';
export * from './testing/lib';
export * from './shortcuts/lib';
export { default as EventDispatcher } from './EventDispatcher';
export { default as Pointer, PointerDevice } from './Pointer';
export { default as UndoRedoHistory } from './UndoRedoHistory';

import AbstractToolbar from './toolbar/AbstractToolbar';

export {
	Editor, EditorSettings, AbstractToolbar,

	/**
	 * Using the HTMLToolbar alias is deprecated. Use
	 * `AbstractToolbar` instead.
	 * @deprecated
	 */
	AbstractToolbar as HTMLToolbar,
};
export default Editor;