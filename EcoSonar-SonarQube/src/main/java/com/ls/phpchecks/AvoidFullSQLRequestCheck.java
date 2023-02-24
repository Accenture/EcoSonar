package com.ls.phpchecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.php.api.tree.Tree;
import org.sonar.plugins.php.api.tree.Tree.Kind;
import org.sonar.plugins.php.api.tree.expression.LiteralTree;
import org.sonar.plugins.php.api.visitors.PHPSubscriptionCheck;

import java.util.Arrays;
import java.util.List;

@Rule(
		key = AvoidFullSQLRequestCheck.KEY,
		name = AvoidFullSQLRequestCheck.ERROR_MESSAGE,
		description = AvoidFullSQLRequestCheck.ERROR_MESSAGE,
		priority = Priority.MINOR,
		tags = {"eco-design"}
)

public class AvoidFullSQLRequestCheck extends PHPSubscriptionCheck {

	public static final String ERROR_MESSAGE = "Don't use the query SELECT * FROM";
	private static final String REGEXPSELECTFROM = "(?i).*select.*\\*.*from.*";
	public static final String KEY = "S74";

	@Override
	public List<Kind> nodesToVisit() {
		return Arrays.asList(Kind.REGULAR_STRING_LITERAL);
	}

	@Override
	public void visitNode(Tree tree) {

		LiteralTree literal = (LiteralTree) tree;
		if(literal.value().matches(REGEXPSELECTFROM))
			context().newIssue(this, tree, ERROR_MESSAGE);

	}
}
