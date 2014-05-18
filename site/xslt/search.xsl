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
    <<namespace>>
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
    
    <xsl:if test="$nodesCount > 0">
        <xsl:call-template name="chooseDsp">
            <xsl:with-param name="nodes" select="$nodes" />
        </xsl:call-template>
    </xsl:if>
</xsl:template>

<xsl:template name="chooseDsp">
    <xsl:param name="nodes" />
    
    <xsl:variable name="item1" select="$nodes[1]" />
    
    <xsl:choose>
        <xsl:when test="$item1 instance of xs:anyAtomicType">
            <xsl:call-template name="dspSimple">
                <xsl:with-param name="nodes" select="$nodes" />
            </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
            <xsl:call-template name="chooseDsp2">
                <xsl:with-param name="nodes" select="$nodes" />
                <xsl:with-param name="item1" select="$item1" />
            </xsl:call-template>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template name="chooseDsp2">
    <xsl:param name="nodes" />
    <xsl:param name="item1" />
    
    <xsl:choose>
        <xsl:when test="count($item1/child::*) > 0">
            <xsl:call-template name="dspElements">
                <xsl:with-param name="nodes" select="$nodes" />
                <xsl:with-param name="item1" select="$item1" />
            </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
            <xsl:call-template name="dspSimple">
                <xsl:with-param name="nodes" select="$nodes" />
            </xsl:call-template>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template name="dspSimple">
    <xsl:param name="nodes" />
    
    <table class="table table-striped table-condensed table-bordered">
        <tbody>
        <xsl:for-each select="$nodes">
            <xsl:sort select="."/>
            <tr>
                <xsl:if test="position() mod 2 = 0">
                    <xsl:attribute name="class">alt-row</xsl:attribute>
                </xsl:if>
                <td class="count-column"><xsl:value-of select="position()" /></td>
                <td><xsl:value-of select="." /></td>
            </tr>
        </xsl:for-each>
        </tbody>
    </table>
</xsl:template>

<xsl:template name="dspElements">
    <xsl:param name="nodes" />
    <xsl:param name="item1" />
    
    <xsl:variable name="columns" select="$item1/child::*" />
    
    <table class="table table-striped table-condensed table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <xsl:for-each select="$columns">
                    <th><xsl:value-of select="local-name()" /></th>
                </xsl:for-each>
            </tr>
        </thead>
        <tbody>
            <xsl:for-each select="$nodes">
                <!--<<sort>>-->
                <tr>
                    <xsl:if test="position() mod 2 = 0">
                        <xsl:attribute name="class">alt-row</xsl:attribute>
                    </xsl:if>
                    <td class="count-column"><xsl:value-of select="position()" /></td>
                    <xsl:call-template name="dspElementColumns" />
                </tr>
            </xsl:for-each>
        </tbody>
    </table>
</xsl:template>

<xsl:template name="dspElementColumns">
    <xsl:variable name="columns" select="child::*" />
    
    <xsl:for-each select="$columns">
        <td><xsl:value-of select="." /></td>
    </xsl:for-each>
</xsl:template>

</xsl:transform>

