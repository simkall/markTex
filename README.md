* [1 heading one](#headingone1)
* [1.1 heading](#heading2)
* [1.1.1 heading one](#headingone3)
* [1.1.1.1 heading](#heading4)

# markTex
A LaTex inspired extension of markdown. After installing marktex can run from the command line with ```marktex input.md > output.md```

## Commands
### Input
With the help of the input command you can organize your markdown files into several files. To include a markdown file in document add ```\input(<%file%>)``` where you want the contents of the included file to appear.

### Numbered Headings 
To add numbered headings add ```\numberedHeadings``` anywhere in the document.  

### Table of Contents
To add a table of contents add ```\tableOfContents``` where you want the table of contents to appear.  


## Building & Testing <a name="build"></a>

install dependencies with ```npm install``` to run marktex modified version run ```npm pack``` and ```npm install marktex-x.x.x.tgz``` 

Run tests with ```npm test```


# 1 heading one <a name=headingone1></a>
## 1.1 heading <a name=heading2></a>
### 1.1.1 heading one <a name=headingone3></a>
#### 1.1.1.1 heading <a name=heading4></a>

