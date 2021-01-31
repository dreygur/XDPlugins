const dialogs = require('./dialogs');
const viewport = require('viewport');

let sessionPromise;
let rootNode;
let bookmarks = null;
let pluginContainer;
let bookmarksContainer;
let bookmarkSettingsContainer;
let bookmarkLabelInputElement;
let bookmarkSaveTargetElement;
let footerElement;

function init(selection, documentRoot) {
	
	// Persist settings helper
	rootNode = documentRoot;

	// Bookmark data initialization
	if(!hasInitialized()) {
		if (rootNode.pluginData && rootNode.pluginData.bookmarks) {
			bookmarks = rootNode.pluginData.bookmarks;
		} else {
			initBookmarks(rootNode.globalBounds);
		}
	}

	// Bookmark UI initialization and promise requirements so dialog opens and closes properly
	sessionPromise = initUI();
	sessionPromise.then(onCloseDialog);
	return sessionPromise;
}

function hasInitialized() { return bookmarks !== null; }

function initBookmarks() {
	
	// Default to an all bookmark for viewing entire document
	if (rootNode.children.length > 0) {
		bookmarks = [createBookmark(1, "Bird's-eye View", rootNode.globalBounds, 1)];
	} else {
		bookmarks = [createBookmark(1)];
	}

	// Add empty bookmarks
	for (var i = 1; i < 10; i++) {
		bookmarks.push(createBookmark(i + 1));
	}
}

function initUI() {
	return dialogs.createDialog({ title: 'Bookmarks', styles: generateStyles(), render: generateMarkup }, 600, 320);
}

function createBookmark(id, label, bounds, zoom) {
	return {
		id: id,
		label: label || 'Label', // TODO localize this string
		bounds: bounds || null,
		zoom: zoom || null
	}
}

function createBookmarksContainerUI() {

	// BookmarkContainer
	bookmarksContainer = document.createElement('div');
	bookmarksContainer.id = 'bookmarks';
	bookmarksContainer.classList.add('container-bookmarks');

	// Bookmarks
	bookmarks.map(function appendBookmark(bookmark) {

		// Bookmark
		let bookmarkNode = document.createElement('div');
		bookmarkNode.id = bookmark.id;
		bookmarkNode.classList.add('container-bookmark');
		bookmarksContainer.appendChild(bookmarkNode);
		
		// Bookmark Go
		let bookmarkGoNode = document.createElement('div');
		bookmarkGoNode.classList.add('button-section', 'bookmark-go', 'plugin-button', 'v-center');
		bookmarkNode.appendChild(bookmarkGoNode);
		
		// Bookmark Go Button
		let bookmarkGoButtonNode = document.createElement('img');
		bookmarkGoButtonNode.src = 'assets/img/bookmark-icon.png';
		bookmarkGoNode.appendChild(bookmarkGoButtonNode);
		bookmarkGoNode.addEventListener('click', function(e){ onBookmarkGo(bookmark); });
		
		// Bookmark Label
		let bookmarkLabelNode = document.createElement('div');
		bookmarkLabelNode.classList.add('bookmark-label', 'v-center');
		bookmarkNode.appendChild(bookmarkLabelNode);
		bookmarkLabelNode.addEventListener('click', function(e){ onEditLabel(bookmark); });
		
		// Bookmark Label Inner
		let bookmarkLabelInner = document.createElement('div');
		bookmarkLabelNode.classList.add('bookmark-label-inner');
		bookmarkLabelInner.id = 'bookmark-label-' + bookmark.id;
		bookmarkLabelInner.textContent = bookmark.label;
		bookmarkLabelNode.appendChild(bookmarkLabelInner);
		
		// Bookmark Save
		let bookmarkSaveNode = document.createElement('div');
		bookmarkSaveNode.classList.add('button-section', 'bookmark-save', 'plugin-button', 'v-center');
		bookmarkNode.appendChild(bookmarkSaveNode);
		
		// Bookmark Save Button
		let bookmarkSaveButtonNode = document.createElement('div');
		bookmarkSaveButtonNode.id = 'bookmark-save-' + bookmark.id;
		bookmarkSaveNode.appendChild(bookmarkSaveButtonNode);
		bookmarkSaveNode.addEventListener('click', function(e){ onBookmarkOrReset(bookmark); })
		
		// Contextual UI update
		let isBookmarked = bookmark.bounds !== null;
		let uiUpdateMethod = isBookmarked ? updateBookmarkSaveUI : updateBookmarkResetUI;
		uiUpdateMethod(bookmarkNode, bookmarkSaveButtonNode);
	});
}

function createBookmarkSettingsContainerUI() {

	// bookmarkSettingsContainer
	bookmarkSettingsContainer = document.createElement('div');
	bookmarkSettingsContainer.classList.add('container-settings', 'v-center-left');

	// Bookmarks label
	bookmarkLabelInputElement = document.createElement('input');
	bookmarkLabelInputElement.autofocus = true;
	bookmarkLabelInputElement.setAttribute('type', 'text');
	bookmarkLabelInputElement.setAttribute('uxp-quiet', 'true');
	bookmarkSettingsContainer.appendChild(bookmarkLabelInputElement);

	// Save label
	let editLabelSave = document.createElement('div');
	editLabelSave.classList.add('button-section', 'plugin-button', 'settings-button', 'v-center');
	bookmarkSettingsContainer.appendChild(editLabelSave);

	// Save label button
	let editLabelSaveButton = document.createElement('div');
	editLabelSaveButton.textContent = 'Save';
	editLabelSave.appendChild(editLabelSaveButton);
	editLabelSave.addEventListener('click', function(e){ onEditLabelSave(); });

	// Cancel label
	let editLabelCancel = document.createElement('div');
	editLabelCancel.classList.add('button-section', 'plugin-button', 'settings-button', 'v-center');
	bookmarkSettingsContainer.appendChild(editLabelCancel);

	// Cancel label button
	let editLabelCancelButton = document.createElement('div');
	editLabelCancelButton.textContent = 'Cancel';
	editLabelCancel.appendChild(editLabelCancelButton);
	editLabelCancel.addEventListener('click', function(e){ onEditLabelCancel(); });
}

function updateBookmarkSaveUI(bookmarkNode, bookmarkSaveButtonNode) {
	bookmarkNode.setAttribute('data-reset', 'true');
	bookmarkNode.querySelector('.bookmark-go').classList.remove('disabled');
	bookmarkSaveButtonNode.textContent = 'Reset';
}

function updateBookmarkResetUI(bookmarkNode, bookmarkSaveButtonNode) {
	bookmarkNode.removeAttribute('data-reset');
	bookmarkNode.querySelector('.bookmark-go').classList.add('disabled');
	bookmarkSaveButtonNode.textContent = 'Bookmark';
}

function generateStyles() {
	return `
<style>

/* App */

.container-plugin {
	display: flex;
	flex-direction: column;
}

.container-bookmarks {
	display: flex;
	flex-wrap: wrap;
	width: 600px;
	height: 320px;
	background-color: #F5F5F5;
}

.container-bookmark {
	display: flex;
	flex-direction: column;
	
	width: 104px;
	height: 150px;
	padding: 8px;
	margin: 8px;
	border: 1px solid #e4e4e4;
	text-align: center;
	border-radius: 4px;
}

.container-settings {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	margin: 0 8px;
}

.bookmark-go {
	flex-grow: 2;
}

.bookmark-label {
	flex-grow: 2;
	font-size: 100%;
	overflow: hidden;
}

.bookmark-save {
	flex-grow: 1;
	max-height: 32px;
}

.button-section {
	background-color: white;
	border: 1px solid #e4e4e4;
	text-align: center;
	border-radius: 4px;
}

.plugin-button {
	color: #666666;
	border: 1px solid #e4e4e4;
}

.plugin-button:hover {
	color: #1492E6;
	border-color: #1492E6;
}

.plugin-button.disabled {
  	background-color: transparent;
  	border: none;
}

.plugin-button.disabled:hover {
	color: #666666;
}

.settings-button {
	max-height: 32px;
	padding: 12px;
	margin-right: 4px;
}

.learn-more {
	color: #AAA;
	font-style: italic;
	font-size: 96%;
}

.learn-more:hover {
	color: #1492E6;
}

/* Utils */

.v-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.v-center-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.disabled {
	opacity: .1;
}

	</style>`;
}

function generateMarkup() {

	// pluginContainer
	pluginContainer = document.createElement('div');
    pluginContainer.classList.add('container-plugin');

	createBookmarksContainerUI(bookmarksContainer);
	pluginContainer.appendChild(bookmarksContainer);

	return pluginContainer;
}

function autoClose() {
  let dialog = document.querySelector('dialog');
  dialog.close('ok');
}

function clearActiveElementFocus() {
	if (document.activeElement) {
		document.activeElement.blur();
	}
}

function removeSettingsContainer() {
	if (footerElement && footerElement.querySelector('.container-settings')) {
    footerElement.removeChild(bookmarkSettingsContainer);
  }
}

function saveLabel(bookmark, val) {
	bookmark.label = val;
	document.getElementById('bookmark-label-' + bookmark.id).textContent = bookmark.label;
	removeSettingsContainer();
}

function onBookmarkGo(bookmark) {
	let b = bookmark.bounds;
	if(b === null) return;
	viewport.zoomToRect(b.x, b.y, b.width, b.height);
	autoClose();
}

function onBookmarkOrReset(bookmark) {
	let bookmarkNode = document.getElementById(bookmark.id);
	let bookmarkSaveButtonNode = document.getElementById('bookmark-save-' + bookmark.id);
	let isReset = bookmarkNode.hasAttribute('data-reset');
	let uiUpdateMethod = isReset ? updateBookmarkResetUI : updateBookmarkSaveUI;
	
	bookmark.zoom = isReset ? null : viewport.zoomFactor;
	bookmark.bounds = isReset ? null : viewport.bounds;
	uiUpdateMethod(bookmarkNode, bookmarkSaveButtonNode);

	if(isReset) {
		// Remove settings container and reset label
		saveLabel(bookmark, 'Label');
	}
}

function onEditLabel(bookmark) {
	// Ensure target is set for proper save application
	bookmarkSaveTargetElement = document.getElementById(bookmark.id);

	footerElement = document.querySelector('footer');

	// Only create on first use, subsequent uses are kept in memory by XD
	if(!bookmarkSettingsContainer) {
		createBookmarkSettingsContainerUI();
	}

	// Prevent multiple clicks to edit labels from inserting multiple settings containers
	if(!footerElement.querySelector('.container-settings')) {
		footerElement.insertBefore(bookmarkSettingsContainer, footerElement.firstChild);
	}
	  
	// Update input element for registering a specific bookmark label
	bookmarkLabelInputElement.value = bookmark.label;
	bookmarkLabelInputElement.autofocus = true;
}

function onEditLabelSave() {
	let targetId = bookmarkSaveTargetElement.id;
	let bookmark = bookmarks[targetId - 1];
	saveLabel(bookmark, bookmarkLabelInputElement.value);
}

function onEditLabelCancel() {
	removeSettingsContainer();
}

function onCloseDialog(result) {
	// save
	rootNode.pluginData = { bookmarks: bookmarks };
}

module.exports = {
	commands: {
		menuCommand: init
	}
}