package com.ls;

import com.ls.api.GreenITAnalysis;
import com.ls.web.SustainabilityPageDefinition;
import org.sonar.api.Plugin;

public class EcoSonarPlugin implements Plugin {
    @Override
    public void define(Context context) {
        // api call to launch a GreenIT analysis
        context.addExtension(GreenITAnalysis.class);

        //web interface
        context.addExtension(SustainabilityPageDefinition.class);
    }
}
