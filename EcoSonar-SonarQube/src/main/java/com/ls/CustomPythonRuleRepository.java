/*
 * SonarQube Python Plugin
 * Copyright (C) 2012-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
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

import com.ls.pythonchecks.*;
import org.sonar.api.server.rule.RulesDefinition;
import org.sonar.api.server.rule.RulesDefinitionAnnotationLoader;
import org.sonar.plugins.python.api.PythonCustomRuleRepository;

import java.util.Set;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class CustomPythonRuleRepository implements RulesDefinition, PythonCustomRuleRepository {
    public static final String LANGUAGE = "py";
    public static final String NAME = "Collectif Conception Numérique Responsable";
    public static final String RESOURCE_BASE_PATH = "fr/cnumr/l10n/python/rules/python/";
    public static final String REPOSITORY_KEY = "cnumr-python";
    private static final Set<String> RULE_TEMPLATES_KEY = Collections.emptySet();

    private static void setTemplates(NewRepository repository) {
        RULE_TEMPLATES_KEY.stream()
                .map(repository::rule)
                .filter(Objects::nonNull)
                .forEach(rule -> rule.setTemplate(true));
    }

    @Override
    public void define(Context context) {
        NewRepository repository = context.createRepository(REPOSITORY_KEY, LANGUAGE).setName(NAME);

        RulesDefinitionAnnotationLoader annotationLoader = new RulesDefinitionAnnotationLoader();
        checkClasses().forEach(ruleClass -> annotationLoader.load(repository, ruleClass));
    
        repository.rules().forEach(rule -> rule.setHtmlDescription(loadResource(RESOURCE_BASE_PATH + rule.key() + ".html")));
    
        // Optionally define remediation costs
        Map<String, String> remediationCosts = new HashMap<>();
        remediationCosts.put(AvoidFullSQLRequest.RULE_KEY, "20min");
        remediationCosts.put(AvoidGettersAndSetters.RULE_KEY, "5min");
        remediationCosts.put(AvoidGlobalVariableInFunctionCheck.RULE_KEY, "5min");
        remediationCosts.put(AvoidSQLRequestInLoop.RULE_KEY, "10min");
        remediationCosts.put(AvoidTryCatchFinallyCheck.RULE_KEY, "5min");
        remediationCosts.put(NoFunctionCallWhenDeclaringForLoop.RULE_KEY, "5min");

    repository.rules().forEach(rule -> rule.setDebtRemediationFunction(
      rule.debtRemediationFunctions().constantPerIssue(remediationCosts.get(rule.key()))));

        setTemplates(repository);

        repository.done();
    }

    @Override
    public String repositoryKey() {
        return REPOSITORY_KEY;
    }

    @Override
    public List<Class> checkClasses() {
        return Collections.unmodifiableList(Arrays.asList(
                AvoidGlobalVariableInFunctionCheck.class,
                AvoidFullSQLRequest.class,
                AvoidSQLRequestInLoop.class,
                AvoidTryCatchFinallyCheck.class,
                NoFunctionCallWhenDeclaringForLoop.class,
                AvoidGettersAndSetters.class)
        );
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
