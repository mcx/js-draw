
import * as fs from 'fs';
import * as path from 'path';

import { defaultEditorLocalization } from '../src/localization';

const escapeBackticks = (text: string) => text.replace(/[`]/g, '\\`');

const generateTranslationTemplate = () => {
	const bodyContentLines: string[] = [];

	const addInput = (
		type: string, id: string, attrs: Record<string, string>, required: boolean = false
	) => {
		const lines: string[] = [];
		lines.push(`  - type: ${type}`);
		lines.push(`    id: ${id}`);
		lines.push('    attributes:');

		for (const key in attrs) {
			lines.push(`      ${key}: ${attrs[key]}`);
		}

		lines.push('    validations:');
		lines.push(`      required: ${required}`);

		bodyContentLines.push(...lines);
	};

	const addLabel = (text: string) => {
		bodyContentLines.push('  - type: markdown');
		bodyContentLines.push('    attributes:');
		bodyContentLines.push('      value: |');
		bodyContentLines.push('        ' + text);
	};

	addLabel(`
		Thank you for taking the time to translate \`js-draw\`! If you don't have time to translate
		all of the strings below, feel free to submit an incomplete translation and edit it later.
		Use this template to update an existing translation or to create a new translation.
	`.replace(/\s+/g, ' '));

	addInput('input', 'language-name', {
		label: 'Language',
		description: 'The name of the language to translate to in English (e.g. Spanish)',
	}, true);

	for (const key in defaultEditorLocalization) {
		const englishTranslation = (defaultEditorLocalization as any)[key];
		addInput('input', `translation-${key}`, {
			label: `\`${escapeBackticks(key)}\``,
			description: `Translate \`${escapeBackticks(englishTranslation)}\``,
			placeholder: englishTranslation,
		});
	}

	addInput('textarea', 'additional-comments', {
		label: 'Additional information',
		placeholder: 'Any additional information/comments on the translation can go here.',
	});

	return `name: Translation
# This template is auto-generated by build_tools/buildTranslationTemplate.ts
# Do not modify it directly.
about: Translate the editor to a new language!
title: '[Translation]: '
labels: ['localization']
assignees: ''
body:
${bodyContentLines.join('\n')}
	`;
};

const template = generateTranslationTemplate();

// According to https://stackoverflow.com/a/13650454, fs should
// be able to handle forward and back slashes (both) on Windows (so extra
// path logic shouldn't be needed here.)
const rootDir = path.dirname(__dirname);
const translationTempaltePath = path.join(rootDir, '.github/ISSUE_TEMPLATE/translation.md');

fs.writeFileSync(translationTempaltePath, template);