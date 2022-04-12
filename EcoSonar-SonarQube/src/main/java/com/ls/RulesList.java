package com.ls;

import com.ls.checks.*;
import org.sonar.plugins.java.api.JavaCheck;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RulesList {

    private RulesList() {
    }

    public static List<Class<? extends JavaCheck>> getChecks() {
        List<Class<? extends JavaCheck>> checks = new ArrayList<>();
        checks.addAll(getJavaChecks());
        checks.addAll(getJavaTestChecks());
        return Collections.unmodifiableList(checks);
    }

    public static List<Class<? extends JavaCheck>> getJavaChecks() {
        List<Class<? extends JavaCheck>> javaChecks = new ArrayList<>();
        javaChecks.add(IncrementCheck.class);
        javaChecks.add(NoFunctionCallWhenDeclaringForLoop.class);
        javaChecks.add(AvoidSQLRequestInLoop.class);
        javaChecks.add(AvoidFullSQLRequest.class);
        javaChecks.add(UseCorrectForLoop.class);
        javaChecks.add(UnnecessarilyAssignValuesToVariables.class);
        return javaChecks;
    }

    public static List<Class<? extends JavaCheck>> getJavaTestChecks() {
        return Collections.emptyList();
    }
}
