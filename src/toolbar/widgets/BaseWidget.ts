import Editor from '../../Editor';
import { InputEvtType } from '../../types';
import { toolbarCSSPrefix } from '../HTMLToolbar';
import { makeDropdownIcon } from '../icons';
import { ToolbarLocalization } from '../localization';

export default abstract class BaseWidget {
	protected readonly container: HTMLElement;
	private button: HTMLElement;
	private icon: Element|null;
	private dropdownContainer: HTMLElement;
	private dropdownIcon: Element;
	private label: HTMLLabelElement;
	#hasDropdown: boolean;
	private disabled: boolean = false;
	private subWidgets: BaseWidget[] = [];

	public constructor(
		protected editor: Editor,
		protected localizationTable: ToolbarLocalization,
	) {
		this.icon = null;
		this.container = document.createElement('div');
		this.container.classList.add(`${toolbarCSSPrefix}toolContainer`);
		this.dropdownContainer = document.createElement('div');
		this.dropdownContainer.classList.add(`${toolbarCSSPrefix}dropdown`);
		this.dropdownContainer.classList.add('hidden');
		this.#hasDropdown = false;

		this.button = document.createElement('div');
		this.button.classList.add(`${toolbarCSSPrefix}button`);
		this.label = document.createElement('label');
		this.button.setAttribute('role', 'button');
		this.button.tabIndex = 0;
	}

	protected abstract getTitle(): string;
	protected abstract createIcon(): Element;

	// Add content to the widget's associated dropdown menu.
	// Returns true if such a menu should be created, false otherwise.
	protected fillDropdown(dropdown: HTMLElement): boolean {
		if (this.subWidgets.length === 0) {
			return false;
		}

		for (const widget of this.subWidgets) {
			widget.addTo(dropdown);
		}
		return true;
	}

	protected setupActionBtnClickListener(button: HTMLElement) {
		const clickTriggers = { Enter: true, ' ': true, };
		button.onkeydown = (evt) => {
			let handled = false;

			if (evt.key in clickTriggers) {
				if (!this.disabled) {
					this.handleClick();
					handled = true;
				}
			}

			// If we didn't do anything with the event, send it to the editor.
			if (!handled) {
				this.editor.toolController.dispatchInputEvent({
					kind: InputEvtType.KeyPressEvent,
					key: evt.key,
					ctrlKey: evt.ctrlKey,
				});
			}
		};

		button.onkeyup = evt => {
			if (evt.key in clickTriggers) {
				return;
			}

			this.editor.toolController.dispatchInputEvent({
				kind: InputEvtType.KeyUpEvent,
				key: evt.key,
				ctrlKey: evt.ctrlKey,
			});
		};

		button.onclick = () => {
			if (!this.disabled) {
				this.handleClick();
			}
		};
	}

	protected abstract handleClick(): void;

	protected get hasDropdown() {
		return this.#hasDropdown;
	}

	// Add a widget to this' dropdown. Must be called before this.addTo.
	protected addSubWidget(widget: BaseWidget) {
		this.subWidgets.push(widget);
	}

	// Adds this to [parent]. This can only be called once for each ToolbarWidget.
	public addTo(parent: HTMLElement) {
		this.label.innerText = this.getTitle();

		this.setupActionBtnClickListener(this.button);

		this.icon = null;
		this.updateIcon();

		this.button.replaceChildren(this.icon!, this.label);
		this.container.appendChild(this.button);

		this.#hasDropdown = this.fillDropdown(this.dropdownContainer);
		if (this.#hasDropdown) {
			this.dropdownIcon = this.createDropdownIcon();
			this.button.appendChild(this.dropdownIcon);
			this.container.appendChild(this.dropdownContainer);
		}

		this.setDropdownVisible(false);
		parent.appendChild(this.container);
	}


	protected updateIcon() {
		const newIcon = this.createIcon();
		this.icon?.replaceWith(newIcon);
		this.icon = newIcon;
		this.icon.classList.add(`${toolbarCSSPrefix}icon`);
	}

	public setDisabled(disabled: boolean) {
		this.disabled = disabled;
		if (this.disabled) {
			this.button.classList.add('disabled');
			this.button.setAttribute('aria-disabled', 'true');
		} else {
			this.button.classList.remove('disabled');
			this.button.removeAttribute('aria-disabled');
		}
	}

	public setSelected(selected: boolean) {
		const currentlySelected = this.isSelected();
		if (currentlySelected === selected) {
			return;
		}

		if (selected) {
			this.container.classList.add('selected');
			this.button.ariaSelected = 'true';
		} else {
			this.container.classList.remove('selected');
			this.button.ariaSelected = 'false';
		}
	}

	protected setDropdownVisible(visible: boolean) {
		const currentlyVisible = this.container.classList.contains('dropdownVisible');
		if (currentlyVisible === visible) {
			return;
		}

		if (visible) {
			this.dropdownContainer.classList.remove('hidden');
			this.container.classList.add('dropdownVisible');
			this.editor.announceForAccessibility(
				this.localizationTable.dropdownShown(this.getTitle())
			);
		} else {
			this.dropdownContainer.classList.add('hidden');
			this.container.classList.remove('dropdownVisible');
			this.editor.announceForAccessibility(
				this.localizationTable.dropdownHidden(this.getTitle())
			);
		}

		this.repositionDropdown();
	}

	protected repositionDropdown() {
		const dropdownBBox = this.dropdownContainer.getBoundingClientRect();
		const screenWidth = document.body.clientWidth;

		if (dropdownBBox.left > screenWidth / 2) {
			this.dropdownContainer.style.marginLeft = this.button.clientWidth + 'px';
			this.dropdownContainer.style.transform = 'translate(-100%, 0)';
		} else {
			this.dropdownContainer.style.marginLeft = '';
			this.dropdownContainer.style.transform = '';
		}
	}

	protected isDropdownVisible(): boolean {
		return !this.dropdownContainer.classList.contains('hidden');
	}

	protected isSelected(): boolean {
		return this.container.classList.contains('selected');
	}

	private createDropdownIcon(): Element {
		const icon = makeDropdownIcon();
		icon.classList.add(`${toolbarCSSPrefix}showHideDropdownIcon`);
		return icon;
	}
}