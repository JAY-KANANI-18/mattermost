package main

import (
    "encoding/json"
    "github.com/mattermost/mattermost-server/v6/plugin"
    "io/ioutil"
    "net/http"
)

type Plugin struct {
    plugin.MattermostPlugin
    CachedData map[string]interface{}
}

// OnActivate initializes the plugin and registers custom API endpoints.
func (p *Plugin) OnActivate() error {
    p.API.RegisterPublicRoute("/api/v4/myplugin/fetchdata", p.handleFetchData)
    p.API.RegisterPublicRoute("/api/v4/myplugin/getcacheddata", p.handleGetCachedData)
    return nil
}

// handleFetchData fetches data from an external API and stores it.
func (p *Plugin) handleFetchData(w http.ResponseWriter, r *http.Request) {
    // Call the API on localhost:8065
    resp, err := http.Get("http://localhost:8065/your-api-endpoint")
    if err != nil {
        http.Error(w, "Failed to call API", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    // Read and parse the response body
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "Failed to read response", http.StatusInternalServerError)
        return
    }

    var data map[string]interface{}
    if err := json.Unmarshal(body, &data); err != nil {
        http.Error(w, "Failed to parse response", http.StatusInternalServerError)
        return
    }

    // Store the data in a variable
    p.CachedData = data

    // Respond with the stored data
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

// handleGetCachedData returns the cached data.
func (p *Plugin) handleGetCachedData(w http.ResponseWriter, r *http.Request) {
    if p.CachedData == nil {
        http.Error(w, "No data available", http.StatusNotFound)
        return
    }

    // Respond with the cached data
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(p.CachedData)
}

func main() {
    plugin.ClientMain(&Plugin{})
}
