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
    <xsl:result-document href="#divResults" method="append-content">
        <xsl:call-template name="dsp-results" />
    </xsl:result-document>
</xsl:template>

<xsl:template name="dsp-results">
    <xsl:variable name="nodes" select="<<xpath>>" />
    <xsl:variable name="nodesCount" select="count($nodes)" />
    
    <div class="results-count">Count: <xsl:value-of select="$nodesCount" /></div>
</xsl:template>

</xsl:transform>