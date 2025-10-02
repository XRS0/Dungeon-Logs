package ru.max.searchingservice.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.max.searchingservice.entity.Log;
import ru.max.searchingservice.entity.dto.LogDto;
import ru.max.searchingservice.entity.dto.LogFilter;
import ru.max.searchingservice.filter.LogSpecificationBuilder;
import ru.max.searchingservice.service.LogFilterService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogFiletServiceImpl implements LogFilterService {
    private final LogSpecificationBuilder logSpecificationBuilder;
    private final ElasticsearchClient client;

    public LogFiletServiceImpl(LogSpecificationBuilder logSpecificationBuilder, ElasticsearchClient client) {
        this.logSpecificationBuilder = logSpecificationBuilder;
        this.client = client;
    }

    public Page<LogDto> searchLogs(LogFilter filter, Pageable pageable) {
        Query query = logSpecificationBuilder.build(filter);

        List<SortOptions> sortOptions = sortTheLogs(pageable);

        SearchRequest searchRequest = getSearchRequest(pageable, query, sortOptions);
        
        SearchResponse<Log> response = trySearching(searchRequest);

        List<LogDto> content = response.hits().hits().stream()
                .map(hit -> LogDto.fromEntity(hit.source()))
                .collect(Collectors.toList());

        long total = response.hits().total() != null ? response.hits().total().value() : content.size();

        return new PageImpl<>(content, pageable, total);
    }

    private SearchResponse<Log> trySearching(SearchRequest searchRequest) {
        SearchResponse<Log> response = null;
        try {
            response = client.search(searchRequest, Log.class);
        }catch (ElasticsearchException e){
            e.printStackTrace();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    private SearchRequest getSearchRequest(Pageable pageable, Query query, List<SortOptions> sortOptions) {
        SearchRequest searchRequest = SearchRequest.of(s -> s
                .index("logs")
                .from((int) pageable.getOffset())
                .size(pageable.getPageSize())
                .query(query)
                .sort(sortOptions)
        );
        return searchRequest;
    }

    private List<SortOptions> sortTheLogs(Pageable pageable) {
        List<SortOptions> sortOptions = new ArrayList<>();
        if (pageable.getSort() != null && pageable.getSort().isSorted()) {
            pageable.getSort().forEach(order -> {
                String esField = order.getProperty();
                sortOptions.add(SortOptions.of(so -> so
                        .field(f -> f.field(esField).order(order.isAscending() ? SortOrder.Asc : SortOrder.Desc))
                ));
            });
        } else {
            // дефолт сортировка
            sortOptions.add(SortOptions.of(so -> so
                    .field(f -> f.field("timestamp").order(SortOrder.Desc))
            ));
        }
        return sortOptions;
    }

}

