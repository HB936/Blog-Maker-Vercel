const BlogModel = require('../models/BlogsModel');


class BlogsController {
    publish(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (data.title == '' || data.content == '') {
                        return reject({
                            msg: 'Fill all the details',
                            status: 'draft'
                        });
                    }
                    else {

                        const blog = new BlogModel(
                            {
                                title: data.title,
                                content: data.content,
                                tags: data.tags,
                                status: 'published'
                            }
                        )
                        await blog.save()
                            .then(
                                () => {
                                    resolve(
                                        {
                                            msg: "Blog Created",
                                            status: 'published'
                                        }
                                    )
                                }
                            ).catch(
                                () => {
                                    reject(
                                        {
                                            msg: "Unable to create Blog",
                                            status: 'error'
                                        }
                                    )
                                }
                            )

                    }
                }

                catch (err) {
                    reject(
                        {
                            msg: "Internal Server Error",
                            status: 'error'
                        }
                    )
                }

            }
        )
    }


    saveDraft(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const blog = new BlogModel({
                        title: data.title || '',
                        content: data.content || '',
                        tags: data.tags || [],
                        status: 'draft'
                    });

                    await blog.save()
                        .then(
                            () => {
                                resolve(
                                    {
                                        msg: "Draft Saved",
                                        status: 'draft'
                                    }
                                );
                            }
                        ).catch(
                            () => {
                                reject(
                                    {
                                        msg: "failed to save draft",
                                        status: "error"
                                    }
                                )
                            }
                        )


                } catch (err) {
                    reject({ msg: "Internal Server Error", status: 'error' });
                }
            });
    }

    allBlogs() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const blogs = await BlogModel.find();
                    resolve(
                        {
                            msg: `${blogs.length} blog${blogs.length === 1 ? '' : 's'} found`,
                            blogs,
                            status: 1
                        }
                    )
                } catch (err) {
                    reject(
                        {
                            msg: "Internal Server Error",
                            status: 0
                        }
                    )
                }
            }
        )
    }

    blogsById(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const id = data.params.id;
                    const blog = await BlogModel.findById(id);
                    if (!blog) {
                        return reject({
                            msg: "Blog not found",
                            status: 0
                        });
                    }
                    resolve(
                        {
                            msg: "1 blog found",
                            blog,
                            status: 1
                        }
                    )
                } catch (err) {
                    reject(
                        {
                            msg: "Internal Server Error",
                            status: 0
                        }
                    )
                }
            }
        )
    }

    update(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const id = data.params.id;
                    const blog = await BlogModel.findById(id);
                    if (blog) {
                        BlogModel.updateOne(
                            { _id: id },
                            {
                                ...data.body
                            }
                        ).then(
                            () => {
                                resolve(
                                    {
                                        msg: "Blog Updated",
                                        status: 1
                                    }
                                )
                            }
                        ).catch(
                            () => {
                                reject(
                                    {
                                        msg: "Unable to update the blog",
                                        status: 0
                                    }
                                )
                            }
                        )
                    } else {
                        reject(
                            {
                                msg: "Unable to find user",
                                status: 0
                            }
                        )
                    }
                } catch (err) {
                    reject(
                        {
                            msg: "Internal server error",
                            status: 0
                        }
                    )
                }
            }
        )
    }

    delete(data) {
        return new Promise(
            (resolve, reject) => {
                try {
                    BlogModel.deleteOne({ _id: data.params.id })
                        .then(
                            () => {
                                resolve(
                                    {
                                        msg: "Blog deleted",
                                        status: 1
                                    }
                                )
                            }
                        ).catch(
                            () => {
                                reject(
                                    {
                                        msg: "Unable to delete blog",
                                        status: 0
                                    }
                                )
                            }
                        )
                } catch (err) {
                    reject(
                        {
                            msg: "Internal server error",
                            status: 0
                        }
                    )
                }
            }
        )
    }
}

module.exports = BlogsController;