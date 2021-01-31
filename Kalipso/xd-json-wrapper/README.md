# Adobe XD JSON Wrapper

Adobe XD is a great tool to create interactive prototypes for user experiences. Because they have just started to develop their plugin platform we often have to use some workarounds. Due to the current implementation it is not possible to just use ```JSON.stringify``` on their nodes, artboards or documents.

This library offers methods to wrap them und use ```JSON.stringify``` on them.

## Available Methods

### getXDWrapper

This wrapper wraps any node object on an artboard and makes it suitable for json. It also returns all parent elements.

#### Example
```javascript
import { getXDWrapper } = "xd-json-wrapper";

const node = // use an actual node from an artboard in XD here
const wrappedNode = getXDWrapper(node);

const json = wrappedNode.toJSON();
// or
JSON.stringify(wrappedNode);
```

### getArtboardAsJSON

This wrapper wraps any artboard object and makes it suitable for json. It als returns all children nodes.

#### Example
```javascript
import { getArtboardAsJSON } = "xd-json-wrapper";

const artboard = // use an actual node from an artboard in XD here
const wrappedArtboard = getArtboardAsJSON(artboard);

const json = wrappedArtboard.toJSON();
// or
JSON.stringify(wrappedArtboard);
```

### getDocumentAsJSON

This wrapper wraps the complete XD document and returns a list of all artboards and their childrend nodes.

#### Example
```javascript
import { getDocumentAsJSON } = "xd-json-wrapper";

const documentRoot = // use an actual node from an artboard in XD here
const wrappedArtboard = getDocumentAsJSON(documentRoot);

const json = documentRoot.toJSON();
// or
JSON.stringify(documentRoot);
```

# Contributors
The initial project was created at the Tel Aviv Design Tools Hackathon in 2018.
Members of the group were:

* @svschannak

# MIT License

Copyright (c) 2018 Sven Schannak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.