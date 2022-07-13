package com.ls.web;

import org.sonar.api.web.page.Context;
import org.sonar.api.web.page.Page;
import org.sonar.api.web.page.PageDefinition;

import static org.sonar.api.web.page.Page.Scope.COMPONENT;

public class SustainabilityPageDefinition implements PageDefinition {

  private static final String PLUGIN_KEY = "ecosonar";
  private static final String ANALYSIS_PAGE = "ecosonar_analysis_page";
  private static final String ANALYSIS_PAGE_NAME = "EcoSonar Analysis";
  private static final String CONFIGURATION_PAGE = "ecosonar_configuration_page";
  private static final String CONFIGURATION_PAGE_NAME = "EcoSonar URL Configuration";
  private static final String BESTPRACTICES_PAGE = "ecosonar_bestpractices_page";
  private static final String BESTPRACTICES_PAGE_NAME = "EcoSonar Best Practices";


  @Override
  public void define(Context context) {
    context
      .addPage(Page.builder(PLUGIN_KEY + "/" + ANALYSIS_PAGE)
        .setName(ANALYSIS_PAGE_NAME)
        .setScope(COMPONENT)
        .build());

    context
      .addPage(Page.builder(PLUGIN_KEY + "/" + CONFIGURATION_PAGE)
              .setName(CONFIGURATION_PAGE_NAME)
              .setScope(COMPONENT)
              .build());
    
    context
      .addPage(Page.builder(PLUGIN_KEY + "/" + BESTPRACTICES_PAGE)
              .setName(BESTPRACTICES_PAGE_NAME)
              .setScope(COMPONENT)
              .build());
  }
}
