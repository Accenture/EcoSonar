package com.ls;

import com.ls.api.GreenITAnalysis;
import com.ls.web.SustainabilityPageDefinition;
import org.sonar.api.Plugin;

public class SustainabilityPlugin implements Plugin {
    @Override
    public void define(Context context) {
        // server extensions -> objects are instantiated during server startup
        context.addExtension(MyJavaRulesDefinition.class);

        // batch extensions -> objects are instantiated during code analysis
        context.addExtension(MyJavaFileCheckRegistrar.class);

        // api call to launch a GreenIT analysis
        context.addExtension(GreenITAnalysis.class);

        //web interface
        context.addExtension(SustainabilityPageDefinition.class);
    }
}
