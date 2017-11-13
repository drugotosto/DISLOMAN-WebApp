package com.ferrero.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/disloman")
public class HelloController {

    @Value("${spring.application.name}")
    String appName;

    @GetMapping(value = "/prove")
    public String home(Model model) {
        model.addAttribute("appName",appName);
        return "prove";
    }

    @GetMapping(value = "/home")
    public String homeDisloman() {
        return "home";
    }

}