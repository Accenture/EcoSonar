package com.ls;

import org.sonar.api.server.rule.RulesDefinition;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import org.sonarsource.analyzer.commons.RuleMetadataLoader;

public class MyJavaRulesDefinition implements RulesDefinition {

    // don't change that because the path is hard coded in CheckVerifier
    private static final String RESOURCE_BASE_PATH = "fr/cnumr/l10n/java/rules/java";

    // Add the rule keys of the rules which need to be considered as template-rules
    private static final Set<String> RULE_TEMPLATES_KEY = Collections.emptySet();
    public static final String NAME = "Collectif Conception Numérique Responsable ";
    public static final String LANGUAGE = "java";
    public static final String REPOSITORY_KEY = "cnumr-java";

    @Override
    public void define(Context context) {
        NewRepository repository = context.createRepository(REPOSITORY_KEY, LANGUAGE).setName(NAME);

        RuleMetadataLoader ruleMetadataLoader = new RuleMetadataLoader(RESOURCE_BASE_PATH);

        ruleMetadataLoader.addRulesByAnnotatedClass(repository, new ArrayList<>(RulesList.getChecks()));

        setTemplates(repository);

        repository.done();
    }

    private static void setTemplates(NewRepository repository) {
        RULE_TEMPLATES_KEY.stream()
                .map(repository::rule)
                .filter(Objects::nonNull)
                .forEach(rule -> rule.setTemplate(true));
    }
}
