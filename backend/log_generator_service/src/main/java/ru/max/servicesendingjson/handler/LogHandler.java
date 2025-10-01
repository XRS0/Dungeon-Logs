package ru.max.servicesendingjson.handler;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import ru.max.servicesendingjson.LogsSenderService;

@Controller
public class LogHandler {
    private final LogsSenderService logsSenderService;

    public LogHandler(LogsSenderService logsSenderService) {
        this.logsSenderService = logsSenderService;
    }

    @MessageMapping("/glog")
    //@SendTo("/topic/logs")
    public void send(){
        logsSenderService.send();
    }

}
