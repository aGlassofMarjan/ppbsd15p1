
<body class="">
    <header class="bg-white" style="border-bottom: solid 1px #d3d3d3;">
        <div class="container mx-auto flex justify-between items-center p-4">
            <div class="flex items-center space-x-4">
                <a href="/home">
                    <div class="text-xl font-bold">Medium</div>
                </a>
                <input type="text" placeholder="  Search" class="border rounded-full p-2" style="border-radius: 20px;">

            </div>
           
            <div class="flex items-center space-x-4">
                <a href="/post/<%= post[0].dataValues.Profile.id %>">
                <button class="bg-white px-4 py-2 rounded-full hover:bg-black hover:text-white"
                    style="border: solid 1px black;">Write</button>
                </a>
                    <a href="/user/<%= user.id %>/profile">
                        <div class="w-8 h-8 rounded-full bg-gray-400"></div>
                    </a>
            </div>
        </div>
    </header>
    <div class="container mx-auto flex mt-4">
        <main class="w-2/3 p-4" style="border-right: solid 1px #d3d3d3;">
            <!-- slider category -- optional -->
            <!-- <div class="flex overflow-x-auto space-x-2 mb-4 py-2">
                <button class="category-button">For you</button>
                <button class="category-button">Following</button>
                <button class="category-button">Cryptocurrency</button>
                <button class="category-button">Machine Learning</button>
                <button class="category-button">Apple</button>
                <button class="category-button">Android</button>
                <button class="category-button">Photography</button>
                <button class="category-button">Productivity</button>
            </div> -->
            
            <% post.forEach(el => { %>
                <a href="/post/<%= el.id %>/detail">
                    <%=//JSON.stringify(el.Profile?.profilePict) %>
                    <div class="bg-white p-4 mb-4" style="display: flex;border-bottom: solid 1px #d3d3d3;">
                        <div>
                            <div class="flex align-center">
                                <div class="w-6 h-6 rounded-full bg-gray-400 mr-1">
                                    <img src="<%=el.Profile.profilePict%>"
                                        alt="" class="rounded-full">
                                </div>
                                <p class="text-gray-500 mb-2"><b><%= el.Profile.fullName %></b> · <%= el.createdAt %> · 6 min read</p>
                            </div>
                            <h2 class="text-xl font-bold mb-1 lorafonts"><%= el.title %></h2>
                            <p class="lorafonts"><%- el.content %>
                            </p>
                            <button class="my-3 bg-gray-200 rounded-full px-3 py-1 text-xs">Technology</button>
                        </div>
                        <div class="ml-10">
                            <img style="object-fit: cover;" class="w-60 h-40"
                                src="<%= el.imgURL %>">
                            </img>
                        </div>
                    </div>
                <% }) %>
            </a>
        </main>

        <aside class="w-1/3 p-4">
            <div class="sticky top-0">
                <h2 class="font-semibold mb-4">Your Latest Release</h2>
                <ul class="space-y-2">
                    <li class="flex items-center">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/028/626/672/small_2x/hd-image-ai-generative-free-photo.jpeg"
                            alt="" class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <h3 class="font-semibold text-sm">It happened on Medium: April 2024 roundup</h3>
                            <p class="text-gray-500 text-xs">Medium Staff in The Medium Blog</p>
                        </div>
                    </li>
                    <li class="flex items-center">
                        <div class="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
                        <div>
                            <h3 class="font-semibold text-sm">The Controversial Truth about Tech Debt</h3>
                            <p class="text-gray-500 text-xs">Raphael Moutard</p>
                        </div>
                    </li>
                    <li class="flex items-center">
                        <div class="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
                        <div>
                            <h3 class="font-semibold text-sm">Drama In The Trump Trial</h3>
                            <p class="text-gray-500 text-xs">Liza Donnelly</p>
                        </div>
                    </li>
                </ul>
                <h2 class="font-semibold mt-6 mb-4">Recommended topics</h2>
                <div class="flex flex-wrap gap-2">
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Writing</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Relationships</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Productivity</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Politics</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Psychology</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Money</button>
                    <button class="bg-gray-200 rounded-full px-3 py-1 text-xs">Business</button>
                </div>
                <h2 class="font-semibold mt-6 mb-4">Visit Authors</h2>
                <ul class="space-y-4">
                    <li class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="bg-gray-300 w-8 h-8 rounded-full mr-3"></div>
                            <div>
                                <h3 class="font-semibold text-sm">Crypto Big Stories</h3>
                                <p>I create unique cryptocurrency content, and share tips to hel</p>
                            </div>
                        </div>
                        <button class="bg-blue-500 text-black px-3 py-1 text-xs rounded hover:text-white hover:bg-black"
                            style="border: solid 1px black">Follow</button>
                    </li>
                    <li class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="bg-gray-300 w-8 h-8 rounded-full mr-3"></div>
                            <div>
                                <h3 class="font-semibold text-sm">Ignacio de Gregorio</h3>
                                <p>I break down the frontier AI systems in the world for you.</p>
                            </div>
                        </div>
                        <button class="bg-blue-500 text-black px-3 py-1 text-xs rounded hover:text-white hover:bg-black"
                            style="border: solid 1px black">Follow</button>
                    </li>
                    <li class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="bg-gray-300 w-8 h-8 rounded-full mr-3"></div>
                            <div>
                                <h3 class="font-semibold text-sm">Nikhil Vemu</h3>
                                <p>Apple Geek. | Get the best bargains for your favourite</p>
                            </div>
                        </div>
                        <button class="bg-blue-500 text-black px-3 py-1 text-xs rounded hover:text-white hover:bg-black"
                            style="border: solid 1px black">Follow</button>
                    </li>
                </ul>
            </div>
        </aside>
    </div>
</body>
