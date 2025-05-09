# Dependency Collector

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/shebaoting/dependency-collector.svg)](https://packagist.org/packages/shebaoting/dependency-collector) [![Total Downloads](https://img.shields.io/packagist/dt/shebaoting/dependency-collector.svg)](https://packagist.org/packages/shebaoting/dependency-collector)

**Dependency Collector** is a powerful extension for [Flarum](http://flarum.org) that creates a centralized directory for your community to showcase, share, and discover any type of item—whether it's technical dependencies, project showcases, product listings, resource links, or any other collection of content you wish to feature.

Key features of this extension include:

*   **User Submissions & Approval System:** Community members can submit items, which are then published after administrator review.
*   **Independent & Powerful Tagging System:** Utilize the plugin's built-in, completely separate tagging system to flexibly categorize and organize items. This system is distinct from Flarum's core Tags feature. Administrators can easily manage these custom tags in the backend.
*   **Card-Based Display & Filtering:** Items are presented in an attractive grid card layout, with robust filtering capabilities based on custom tags, allowing users to quickly find what they're looking for.
*   **Built-in Search Functionality:** Users can search item titles or descriptions using keywords.
*   **Highly Customizable Permissions:** Administrators have fine-grained control over submission, moderation, and tag management permissions.

By providing a user-contributed, custom-categorized resource aggregation platform, Dependency Collector aims to engage users, enhance community content value, and boost activity.

![](https://wyz-xyz.oss-cn-huhehaote.aliyuncs.com/2025-05-08/1746705066-417302-image.png)


demo ： https://wyz.xyz/dependencies


## Idea

The initial inspiration was to create a platform for technical communities to collect and showcase dependencies (like libraries, plugins, tools). However, during development, we realized its core functionalities—user submissions, admin approval, an independent custom tagging system, and flexible display—make it broadly applicable to various scenarios.

You can use it for:

*   **Project Showcases:** Collect and display personal projects or team works from community members.
*   **Product Directories:** Create a community-driven list of product recommendations or reviews.
*   **Resource Link Sharing:** Aggregate quality articles, tutorials, tools, and other links for specific domains.
*   **Idea Boards:** Allow users to submit their creative ideas for categorization and discussion.
*   **And much more...** If you need a structured, categorizable, and reviewable item collection and display system, Dependency Collector is up to the task.

## Contact

If you're interested in custom Flarum extension development or other collaborations, you can reach me at:
Email: th9th@th9th.com

## Installation

Install the extension via Composer by running the following command in your Flarum root directory:

```sh
composer require shebaoting/dependency-collector:"*"
php flarum migrate
php flarum cache:clear
```

## Updating

To update the extension, run the following commands:

```sh
composer update shebaoting/dependency-collector:"*"
php flarum migrate
php flarum cache:clear
```

## Usage

1.  **Backend Configuration:**
    *   After installing and enabling the extension, navigate to your Flarum Admin Dashboard -> Item Collector
    *   **Manage Plugin Tags:** First, create your desired custom tags in the 'Manage Plugin Tags' section. These tags will be used to categorize submitted items. You can set the tag's name, slug, color, and icon.
    *   **Set Permissions:** Go to Flarum Admin Dashboard -> Permissions, and find the permission settings related to 'Item Collector' 
        *   Configure who can submit items (e.g., Members).
        *   Configure who can moderate items (e.g., Moderators, Administrators).
        *   Configure who can manage plugin tags (typically Administrators only).

2.  **User Submission:**
    *   Users with submission permission can find the 'Submit Item' button on the 'Item Center' page (or the page you've configured via routes) in the forum frontend.
    *   Upon clicking the button, users will need to fill in the item's title, link, description, and select at least one relevant tag from the custom tags you created in the backend.

3.  **Administrator Moderation:**
    *   Users with moderation permission can find the list of pending items in the plugin's management page within the Flarum Admin Dashboard.
    *   Administrators can view all information for pending items and can edit (including associated custom tags), approve, or reject them.

4.  **Frontend Display:**
    *   All approved items will be visible to all users on the item display page in the forum frontend.
    *   Users can filter and find items of interest by clicking on plugin tags or using the search bar.

## Links

*   **My Community:** [https://wyz.xyz](https://wyz.xyz) 
*   **Packagist:** [https://packagist.org/packages/shebaoting/dependency-collector](https://packagist.org/packages/shebaoting/dependency-collector)
*   **GitHub:** [https://github.com/shebaoting/dependency-collector](https://github.com/shebaoting/dependency-collector) 
*   **Flarum Community Discussion:** [https://discuss.flarum.org/d/YOUR_DISCUSSION_SLUG_HERE](https://discuss.flarum.org/d/YOUR_DISCUSSION_SLUG_HERE) 

## License

This extension is open-sourced software licensed under the [MIT license](LICENSE)
