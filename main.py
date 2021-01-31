
# Import necessary modules
from os import system as c
from sys import platform as _platform
import json
import sys
import time
import os

author = "Rakibul Yeasin"
company = "Slishee"
email = "ryeasin03@gmail.com"

# Function to Install the necessay plugins


def install():
	# Common part of the installation command
	cmd = f'code --install-extension '
	f = ' --force'

	"""
		Plugins
	"""
	c(cmd + 'ms-python.python' + f)  # Python Intellisense <3
	c(cmd + 'octref.vetur' + f)  # VueJS Support inside VSCode
	c(cmd + 'HookyQR.beautify' + f)  # Install Beautify
	c(cmd + 'ms-vscode.cpptools' + f)  # Install C/C++ by Microsoft
	c(cmd + 'dart-code.dart-code' + f)  # Dart Language Support
	c(cmd + 'dbaeumer.vscode-eslint' + f)  # Javascript Linter
	# c(cmd + 'oderwat.indent-rainbow' + f) # Make Indentation awesome!
	c(cmd + 'xabikos.javascriptsnippets' + f)  # ES6 Snippest
	c(cmd + 'ritwickdey.liveserver' + f)  # Live Preview for web-designs
	c(cmd + 'davidanson.vscode-markdownlint' + f)  # Markdown Linting
	c(cmd + 'eg2.vscode-npm-script' + f)  # nmp Support from VSCode
	c(cmd + 'felixfbecker.php-debug' + f)  # PHP Debugging
	c(cmd + 'formulahendry.terminal' + f)  # VSCode Terminal
	c(cmd + 'psioniq.psi-header' + f)  # psioniq File Header
	c(cmd + 'ritwickdey.LiveServer' + f)  # Live Server
	c(cmd + 'alexcvzz.vscode-sqlite' + f)  # SQLite Browser

	# PyLint
	if _platform.startswith('linux') or _platform == 'darwin':
		c('python3 -m pip install -U pylint --user')
	elif _platform.startswith('win'):
		c('python3 -m pip install -U pylint --user')

	"""
		Themes
	"""
	c(cmd + 'Equinusocio.vsc-material-theme')  # Material Theme


def configure():
	"""
		Finding out the way to configure easily.
		Till then this function is useless.
		* Have a nice cup of coffee in your dream!
	"""

	if _platform.startswith('linux'):
		path = os.environ['HOME'] + '/.config/Code/User/settings.json'
	elif _platform.startswith('win'):
		dir_path = os.path.join(os.getenv('APPDATA'), "Code", "User")
		path = os.path.join(dir_path, "settings.json")
		try:
			os.makedirs(dir_path)
			with open('path', "w+") as f:
				f.write("")
		except:
			pass
		# path = os.path.join("%APPDATA%", "Code", "User", "settings.json")
	elif _platform == 'darwin':
		path = os.environ['HOME'] + \
			'/Library/Application Support/Code/User/settings.json'
	try:
		settings = {
			# Editor
			"editor.formatOnPaste": True,
			"editor.formatOnType": True,
			"editor.multiCursorModifier": "ctrlCmd",
			"editor.tabCompletion": "on",
			"editor.tabSize": 4,
			# Workbench Settings
			"workbench.colorTheme": "Default Dark+",
			"workbench.startupEditor": "none",
			# Files
			"files.autoSave": "onFocusChange",
			"files.trimTrailingWhitespace": True,
			# Use ES6
			"jshint.options": {
				"esversion": 6
			},
			# PSI Plugin
			"psi-header.changes-tracking": {
				"isActive": True,
				"modAuthor": "Modified By: ",
				"modDate": "Last Modified: ",
				"modDateFormat": "DD MM YYYY, h:mm:ss A",
				"autoHeader": "manualSave",
			},
			"psi-header.variables": [
				["company", company],
				["author", author],
				["authoremail", email]
			],
			"psi-header.lang-config": [
				{
					"language": "python",
					"begin": "###",
					"prefix": "# ",
					"end": "###",
					"blankLinesAfter": 0,
					"beforeHeader": [
						"#!/usr/bin/env python3",
						"# -*- coding:utf-8 -*-"
					]
				},
				{
					"language": "shellscript",
					"begin": "###",
					"prefix": "# ",
					"end": "###",
					"blankLinesAfter": 0,
					"beforeHeader": [
						"#!/bin/bash"
					]
				},
				{
					"language": "javascript",
					"begin": "/*",
					"prefix": " * ",
					"end": " */",
					"blankLinesAfter": 0
				},
				{
					"language": "go",
					"begin": "/*",
					"prefix": " * ",
					"end": " */",
					"blankLinesAfter": 0,
					"afterHeader": [
						"\npackage main\n",
						"import \"fmt\"\n",
						"func main() {\n    fmt.Println(\"Hello Go!\")\n}"
					]
				}
			],
			"psi-header.templates": [
				{
					"language": "*",
					"template": [
						"File: <<filename>>",
						"Created: <<filecreated('dddd, Do MMMM YYYY h:mm:ss a')>>",
						"Author: <<author>> (<<authoremail>>)",
						"-----",
						"Last Modified: <<dateformat('dddd, Do MMMM YYYY h:mm:ss a')>>",
						"Modified By: <<author>> (<<authoremail>>)",
						"-----",
						"Copyright (c) <<year>> <<company>>"
						""
					]
				}
			]
		}

		with open(path, 'w') as settings_file:
			json.dump(settings, settings_file, indent=4)

		print('VSCode Configured Successfully!')

	except Exception as e:
		print(f'There was an error.\n{e}\nPlease Try again!')


def main():
	"""
		The main Function of this useless Script.
		You may not like/love this but it will help you definitely {or tear-down you :) }.
		Love from Rakibul
	"""
	try:
		install()
		configure()
	except KeyboardInterrupt:
		print('You killed me :( ')
		sys.exit(1)
	except IOError:
		print('You\'re not connected to internet.\nTry to connect.\nI\'m retrying after 3 seconds...')
		time.sleep(3)
		install()
		configure()
	except IndentationError:
		print('Kill the developer...\nHe missed indentation in \'Pyton\'')
		sys.exit(1)

	sys.exit(0)


if __name__ == '__main__':
	main()


"""

ctrl + ~


"""