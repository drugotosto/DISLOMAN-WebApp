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

    @GetMapping(value = {"", "/", "/home"})
    public String home(Model model) {
        model.addAttribute("appName",appName);
        return "home";
    }

    @GetMapping(value = "/calendar")
    public String calendar() {return "calendar"; }

    @GetMapping(value = "/sensorData")
    public String sensorData() {return "sensorData"; }

    @GetMapping(value = "/profile")
    public String profile() {return "profile"; }

    @GetMapping(value = "/login")
    public String login() {return "login"; }

}