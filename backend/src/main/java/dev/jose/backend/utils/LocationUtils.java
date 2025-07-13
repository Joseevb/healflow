package dev.jose.backend.utils;


import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

public class LocationUtils {

    private LocationUtils() {}

    /**
     * Builds a URI for a newly created resource based on the current request URI and the resource's
     * ID. This is typically used to set the Location header in a 201 Created response.
     *
     * <p>Assumes the current request path is the collection URI and the resource URI is the
     * collection URI followed by the resource ID as a path segment.
     *
     * <p>Use this method when a POST to `/collection` creates a resource at `/collection/{id}`.
     *
     * @param resourceId The ID of the newly created resource.
     * @return The URI of the newly created resource.
     * @throws IllegalStateException if not called within an active HTTP request context.
     */
    public static URI buildLocationUriFromCurrentRequest(Object resourceId) {
        return ServletUriComponentsBuilder.fromCurrentRequestUri()
                .pathSegment(resourceId.toString())
                .build()
                .toUri();
    }

    /**
     * Builds a URI for a newly created resource based on a specified base path and the resource's
     * ID, starting from the current context path. This is typically used to set the Location header
     * in a 201 Created response.
     *
     * <p>Use this method when a request to one URI (e.g., `/auth/register`) creates a resource at a
     * different, specific base path (e.g., `/api/v1/users/{id}`).
     *
     * @param basePath The base path for the new resource (e.g., "/api/v1/users"). Should start with
     *     a '/' or be empty.
     * @param resourceId The ID of the newly created resource.
     * @return The URI of the newly created resource.
     * @throws IllegalStateException if not called within an active HTTP request context.
     */
    public static URI buildLocationUri(String basePath, Object resourceId) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(basePath)
                .pathSegment(resourceId.toString())
                .build()
                .toUri();
    }
}
