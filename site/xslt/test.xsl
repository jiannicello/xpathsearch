<xsl:transform
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
    xmlns:js="http://saxonica.com/ns/globalJS"
    xmlns:prop="http://saxonica.com/ns/html-property"
    xmlns:style="http://saxonica.com/ns/html-style-property"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs prop"
    extension-element-prefixes="ixsl"
    version="2.0"
>
<xsl:template name="main" match="/">
    <xsl:result-document href="#main" method="append-content">
        <xsl:apply-templates select="poem"/>
    </xsl:result-document>
</xsl:template>

<xsl:template match="poem">
    <xsl:apply-templates select="title, author, date, stanza" />
</xsl:template>

<xsl:template match="title">
    <div align="center">
        <h1><xsl:value-of select="." /></h1>
    </div>
</xsl:template>

<xsl:template match="author">
    <div align="center">
        <h2> By <xsl:value-of select="." /></h2>
    </div>
</xsl:template>

<xsl:template match="date">
    <p><i><xsl:value-of select="." /></i></p>
</xsl:template>

<xsl:template match="stanza">
     <p><xsl:apply-templates select="line" /></p>
</xsl:template>

<xsl:template match="line">
     <xsl:if test="position() mod 2 = 0">&#160;&#160;</xsl:if>
         <xsl:value-of select="." /><br />
</xsl:template>

</xsl:transform>    