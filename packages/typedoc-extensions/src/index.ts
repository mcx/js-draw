import { Application, ParameterType } from 'typedoc';
import CustomTheme from './CustomTheme';

export const load = (app: Application) => {
	app.options.addDeclaration({
		name: 'sidebarReplacements',
		type: ParameterType.Object,
		help: 'maps navigation text to replacement text',
		defaultValue: {},
	});
	app.options.addDeclaration({
		name: 'includeBaseDirectory',
		type: ParameterType.Path,
		help: 'base directory for all [[include:]] directives',
		defaultValue: undefined,
	});
	app.options.addDeclaration({
		name: 'redirects',
		type: ParameterType.Object,
		help: 'map from source paths to redirect paths',
		defaultValue: {},
	});

	app.renderer.defineTheme('js-draw-theme', CustomTheme);

	// Work around TypeDoc being unable to resolve symbols in different packages in
	// a fragile way.
	app.converter.addUnknownSymbolResolver((declaration) => {
		// Ref https://github.com/Gerrit0/typedoc-plugin-mdn-links/blob/main/src/index.ts
		const moduleSource = declaration.moduleSource ?? '';
		if (moduleSource.startsWith('@js-draw/')) {
			const name = declaration.symbolReference?.path?.map((path) => path.path).join('.');

			// We can't find the symbol if it's name is "default"
			if (name && name !== 'default') {
				const toTypeDocName = (s: string) => s.replace(/[^a-zA-Z0-9-]/g, '_');
				const moduleValue = toTypeDocName(moduleSource);
				const nameValue = toTypeDocName(name);

				// TODO: This is extremely fragile.
				return {
					target: `data:text/plain;utf-8,corrected-link=${moduleValue},${nameValue}`,
					name,
				};
			}
		}
		return undefined;
	});
};
