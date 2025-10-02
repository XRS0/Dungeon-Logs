package ru.max.searchingservice.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.max.searchingservice.entity.Log;
import ru.max.searchingservice.entity.dto.LogDto;
import ru.max.searchingservice.entity.dto.LogFilter;
import ru.max.searchingservice.service.impl.LogFiletServiceImpl;

@RestController
public class LogController {
    private final LogFiletServiceImpl logFiletService;

    public LogController(LogFiletServiceImpl logFiletService) {
        this.logFiletService = logFiletService;
    }

    @GetMapping("/logs")
    public Page<LogDto> getLogs(LogFilter logFilter,
                                Pageable pageable
                                ) throws Exception{
        Log log = new Log();
        log.setWorkspace(logFilter.getWorkspace());
        log.setLevel(logFilter.getLevel());
        log.setSearch(logFilter.getSearch());
        return logFiletService.searchLogs(logFilter, pageable);
    }
}
