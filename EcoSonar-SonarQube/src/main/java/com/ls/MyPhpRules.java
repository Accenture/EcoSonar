/*
 * SonarQube PHP Custom Rules Example
 * Copyright (C) 2016-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package com.ls;

import com.ls.phpchecks.*;
import org.sonar.api.server.rule.RulesDefinition;
import org.sonar.api.server.rule.RulesDefinitionAnnotationLoader;
import org.sonar.plugins.php.api.visitors.PHPCustomRuleRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Objects;
import java.util.Set;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

/**
 * Extension point to define a PHP rule repository.
 */
public class MyPhpRules implements RulesDefinition, PHPCustomRuleRepository {

  public static final String LANGUAGE = "php";
  public static final String NAME = "Collectif Conception Numérique Responsable";
  public static final String RESOURCE_BASE_PATH = "fr/cnumr/l10n/php/rules/custom/";
  public static final String REPOSITORY_KEY = "cnumr-php";
  private static final Set<String> RULE_TEMPLATES_KEY = Collections.emptySet();

  /**
   * Provide the repository key
   */
  @Override
  public String repositoryKey() {
    return REPOSITORY_KEY;
  }

  /**
   * Provide the list of checks class that implements rules
   * to be part of the rule repository
   */
  @Override
  public List<Class<?>> checkClasses() {
    
    return Collections.unmodifiableList(Arrays.asList(
      AvoidDoubleQuoteCheck.class,
      AvoidFullSQLRequestCheck.class,
      AvoidSQLRequestInLoopCheck.class, 
      AvoidTryCatchFinallyCheckNOKfailsAllTryStatements.class, 
      AvoidUsingGlobalVariablesCheck.class,
      IncrementCheck.class, 
      NoFunctionCallWhenDeclaringForLoop.class,
      UseOfMethodsForBasicOperations.class));

  }

  @Override
  public void define(Context context) {
    NewRepository repository = context.createRepository(REPOSITORY_KEY, LANGUAGE).setName(NAME);

    RulesDefinitionAnnotationLoader annotationLoader = new RulesDefinitionAnnotationLoader();
    checkClasses().forEach(ruleClass -> annotationLoader.load(repository, ruleClass));

    repository.rules().forEach(rule -> rule.setHtmlDescription(loadResource(RESOURCE_BASE_PATH + rule.key() + ".html")));

    // Optionally define remediation costs
    Map<String, String> remediationCosts = new HashMap<>();
    remediationCosts.put(AvoidDoubleQuoteCheck.KEY, "5min");
    remediationCosts.put(AvoidFullSQLRequestCheck.KEY, "20min");
    remediationCosts.put(AvoidSQLRequestInLoopCheck.KEY, "10min");
    remediationCosts.put(AvoidTryCatchFinallyCheckNOKfailsAllTryStatements.KEY, "5min");
    remediationCosts.put(AvoidUsingGlobalVariablesCheck.KEY, "5min");
    remediationCosts.put(IncrementCheck.KEY, "5min");
    remediationCosts.put(NoFunctionCallWhenDeclaringForLoop.KEY, "5min");
    remediationCosts.put(UseOfMethodsForBasicOperations.KEY, "5min");

    repository.rules().forEach(rule -> rule.setDebtRemediationFunction(
      rule.debtRemediationFunctions().constantPerIssue(remediationCosts.get(rule.key()))));

    setTemplates(repository);

    repository.done();
  }

  private static void setTemplates(NewRepository repository) {
    RULE_TEMPLATES_KEY.stream()
            .map(repository::rule)
            .filter(Objects::nonNull)
            .forEach(rule -> rule.setTemplate(true));
  }

  private String loadResource(String path) {
    // The class loader that loaded the class
    ClassLoader classLoader = getClass().getClassLoader();
    InputStream inputStream = classLoader.getResourceAsStream(path);
    if (inputStream == null) {
      throw new IllegalStateException("Resource not found: " + path);
    }
    try {
      return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to read resource: " + path, e);
    }
  }
}
