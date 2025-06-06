import { Color4 } from '@js-draw/math';
import Editor from '../../../Editor';
import PipetteTool from '../../../tools/PipetteTool';
import { EditorEventType } from '../../../types';
import type HelpDisplay from '../../utils/HelpDisplay';
import createButton from '../../../util/dom/createButton';

type OnColorChangeListener = (color: Color4) => void;

// Returns [ color input, input container, callback to change the color value ].
export const makeColorInput = (editor: Editor, onColorChange: OnColorChangeListener) => {
	const container = document.createElement('span');

	const inputWrapper = document.createElement('span');
	const colorInput = document.createElement('input');

	colorInput.type = 'button';
	colorInput.classList.add('coloris_input');
	container.classList.add('color-input-container');
	inputWrapper.classList.add('color-input-wrapper');

	inputWrapper.appendChild(colorInput);
	container.appendChild(inputWrapper);

	const pipetteController = addPipetteTool(editor, container, (color: Color4) => {
		colorInput.value = color.toHexString();
		onInputEnd();

		// Update the color preview, if it exists (may be managed by Coloris).
		const parentElem = colorInput.parentElement;
		if (parentElem && parentElem.classList.contains('clr-field')) {
			parentElem.style.color = colorInput.value;
		}
	});

	let currentColor: Color4 | undefined;
	const handleColorInput = () => {
		currentColor = Color4.fromHex(colorInput.value);
	};

	// Only change the pen color when we finish sending input (this limits the number of
	// editor events triggered and accessibility announcements).
	const onInputEnd = () => {
		handleColorInput();

		if (currentColor) {
			editor.announceForAccessibility(
				editor.localization.colorChangedAnnouncement(currentColor.toHexString()),
			);
			onColorChange(currentColor);
			editor.notifier.dispatch(EditorEventType.ColorPickerColorSelected, {
				kind: EditorEventType.ColorPickerColorSelected,
				color: currentColor,
			});
		}
	};

	colorInput.oninput = handleColorInput;
	let isOpen = false;
	colorInput.addEventListener('open', () => {
		isOpen = true;
		editor.notifier.dispatch(EditorEventType.ColorPickerToggled, {
			kind: EditorEventType.ColorPickerToggled,
			open: true,
		});
		pipetteController.cancel();
		container.classList.add('picker-open');

		// Focus the Coloris color picker, if it exists.
		// Don't focus the text input within the color picker, however,
		// as this displays a keyboard on mobile devices.
		const colorPickerElem: HTMLElement | null = document.querySelector(
			'#clr-picker #clr-hue-slider',
		);
		colorPickerElem?.focus();
	});

	const onClose = () => {
		isOpen = false;
		editor.notifier.dispatch(EditorEventType.ColorPickerToggled, {
			kind: EditorEventType.ColorPickerToggled,
			open: false,
		});
		onInputEnd();

		// Restore focus to the input that opened the color picker
		colorInput.focus();

		container.classList.remove('picker-open');
	};
	colorInput.addEventListener('close', () => {
		onClose();
	});

	const setColorInputValue = (color: Color4 | string) => {
		if (typeof color === 'object') {
			color = color.toHexString();
		}

		colorInput.value = color;

		// Fire all color event listeners. See
		// https://github.com/mdbassit/Coloris#manually-updating-the-thumbnail
		colorInput.dispatchEvent(new Event('input', { bubbles: true }));
	};

	return {
		input: colorInput,
		container,
		setValue: setColorInputValue,
		closePicker: () => {
			if (isOpen) {
				onInputEnd();
			}
		},
		registerWithHelpTextDisplay: (helpDisplay: HelpDisplay) => {
			helpDisplay.registerTextHelpForElement(
				inputWrapper,
				editor.localization.colorPickerToggleHelpText,
			);
			pipetteController.registerWithHelpTextDisplay(helpDisplay);
		},
	};
};

const addPipetteTool = (
	editor: Editor,
	container: HTMLElement,
	onColorChange: OnColorChangeListener,
) => {
	const pipetteButton = createButton();
	pipetteButton.classList.add('pipetteButton');
	pipetteButton.title = editor.localization.pickColorFromScreen;
	pipetteButton.setAttribute('alt', pipetteButton.title);

	const pickColorLabel = document.createElement('span');
	pickColorLabel.classList.add('pickColorInstructions');
	pickColorLabel.innerText = editor.localization.clickToPickColorAnnouncement;

	const updatePipetteButtonContent = (color?: Color4) => {
		pipetteButton.replaceChildren(editor.icons.makePipetteIcon(color), pickColorLabel);
	};
	updatePipetteButtonContent();

	const pipetteTool: PipetteTool | undefined =
		editor.toolController.getMatchingTools(PipetteTool)[0];

	const endColorSelectMode = () => {
		pipetteTool?.clearColorListener();
		updatePipetteButtonContent();
		pipetteButton.classList.remove('active');
	};

	const pipetteColorSelect = (color: Color4 | null) => {
		endColorSelectMode();

		if (color) {
			onColorChange(color);
		}
	};

	const pipetteColorPreview = (color: Color4 | null) => {
		if (color) {
			updatePipetteButtonContent(color);
		} else {
			updatePipetteButtonContent();
		}
	};

	pipetteButton.onclick = () => {
		// If already picking, cancel it.
		if (pipetteButton.classList.contains('active')) {
			endColorSelectMode();
			editor.announceForAccessibility(editor.localization.colorSelectionCanceledAnnouncement);
			return;
		}

		pipetteTool?.setColorListener(pipetteColorPreview, pipetteColorSelect);

		if (pipetteTool) {
			pipetteButton.classList.add('active');

			editor.announceForAccessibility(editor.localization.clickToPickColorAnnouncement);
		}
	};

	container.appendChild(pipetteButton);

	return {
		// Cancel a pipette color selection if one is in progress.
		cancel: () => {
			endColorSelectMode();
		},

		registerWithHelpTextDisplay: (helpDisplay: HelpDisplay) => {
			helpDisplay.registerTextHelpForElement(
				pipetteButton,
				editor.localization.colorPickerPipetteHelpText,
			);
		},
	};
};

export default makeColorInput;
